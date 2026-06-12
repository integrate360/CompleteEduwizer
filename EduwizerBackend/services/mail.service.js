const { SESClient, SendEmailCommand } = require("@aws-sdk/client-ses");

function normalizeEmailAddress(value) {
  if (!value) return null;
  if (typeof value === "string") return value;
  if (typeof value === "object" && value.email) {
    if (value.name) return `${value.name} <${value.email}>`;
    return value.email;
  }
  return String(value);
}

function normalizeToAddresses(to) {
  if (!to) return [];
  const asArray = Array.isArray(to) ? to : [to];
  return asArray.map(normalizeEmailAddress).filter(Boolean);
}

function getAwsConfig() {
  // Required envs per requirement:
  // - AWS_ACCESS_KEY_ID
  // - AWS_SECRET_ACCESS_KEY
  // - AWS_REGION
  //
  // Backwards-compatible fallbacks (already present in this repo):
  // - AWS_ACCESS_KEY / AWS_SECRET_KEY / REGION
  const accessKeyId = process.env.AWS_ACCESS_KEY_ID || process.env.AWS_ACCESS_KEY;
  const secretAccessKey =
    process.env.AWS_SECRET_ACCESS_KEY || process.env.AWS_SECRET_KEY;
  const region = process.env.AWS_REGION || process.env.REGION || "ap-south-1";

  if (!accessKeyId || !secretAccessKey || !region) {
    throw new Error(
      "Missing AWS SES credentials/region. Set AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION."
    );
  }

  return { accessKeyId, secretAccessKey, region };
}

let sesClient;
function getSesClient() {
  if (sesClient) return sesClient;
  const { accessKeyId, secretAccessKey, region } = getAwsConfig();
  sesClient = new SESClient({
    region,
    credentials: { accessKeyId, secretAccessKey },
  });
  return sesClient;
}

/**
 * SendGrid-compat shim used by existing controllers:
 * - setApiKey(...) returns an object with `.send(...)`
 * - send(msg) returns a Promise resolving to [ { statusCode }, { messageId } ]
 */
const mailService = {
  setApiKey: function setApiKey(_) {
    // No-op for SES; kept only to avoid changing controller logic.
    return this;
  },

  send: async function send(msg) {
    try {
      const toAddresses = normalizeToAddresses(msg && msg.to);
      const fromAddress = normalizeEmailAddress(msg && msg.from);
      const subject = msg && msg.subject;
      const html = msg && msg.html;
      const text = msg && msg.text;

      if (!toAddresses.length) throw new Error('Missing "to" in email payload');
      if (!fromAddress) throw new Error('Missing "from" in email payload');
      if (!subject) throw new Error('Missing "subject" in email payload');
      if (!html && !text) throw new Error('Missing "html" or "text" in email payload');

      const params = {
        Source: fromAddress,
        Destination: { ToAddresses: toAddresses },
        Message: {
          Subject: { Data: String(subject), Charset: "UTF-8" },
          Body: {},
        },
      };

      if (html) params.Message.Body.Html = { Data: String(html), Charset: "UTF-8" };
      if (text) params.Message.Body.Text = { Data: String(text), Charset: "UTF-8" };

      const client = getSesClient();
      const result = await client.send(new SendEmailCommand(params));

      const messageId = result && result.MessageId ? result.MessageId : null;

      // Keep existing controller response logic intact (they read [0].statusCode)
      return [
        { statusCode: 202, messageId },
        { messageId },
      ];
    } catch (error) {
      console.error("[ses] sendEmail failed:", error && error.message ? error.message : error);
      throw error;
    }
  },
};

module.exports = mailService;

