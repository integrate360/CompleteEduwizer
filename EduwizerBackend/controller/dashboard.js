const dashboardService = require("../services/dashboard.service");
const sgMail = require("../services/mail.service");

const controllers = {
  susbcribe: async function (req, res) {
    let response;
    try {
      let { email } = req.body;
      let postBody = { email };

      // Save to DB
      let data = await dashboardService.susbcribe(postBody);

      if (data) {
        // ✅ Send confirmation email
        sgMail.setApiKey(process.env.EMAIL_PROVIDER_AUTH_PASSWORD);

        const msg = {
          to: email, // subscriber email
          from: process.env.EMAIL, // your verified sender email
          subject: "Subscription Confirmed",
          html: `
            <h2>Welcome to Eduwizer!</h2>
            <p>Thank you for subscribing. You'll now receive our latest updates and news.</p>
          `,
        };

        const messageSendData = await sgMail.send(msg);

        response = {
          success: 1,
          data: {
            user: data,
            emailStatus: messageSendData[0].statusCode,
          },
          message: "Successfully Subscribed User and Email Sent",
        };
      } else {
        response = {
          success: 0,
          data: data,
          message: "Error While Subscribing User",
        };
      }
    } catch (error) {
      console.error(error);
      response = {
        success: 0,
        data: {},
        message: error.message,
      };

      if (error?.message?.includes("E11000 duplicate key error collection")) {
        response.message = "User Already Subscribed";
      }
    }
    return res.send(response);
  },

  contactUs: async function (req, res) {
    let response;
    try {
      let data = await dashboardService.contactUs(req.body);

      if (data) {
        const apiKey = sgMail.setApiKey(
          process.env.EMAIL_PROVIDER_AUTH_PASSWORD
        );

        const msg = {
          to: process.env.SUPPORT_EMAIL, // support Email
          from: process.env.EMAIL, // Change to your verified sender
          subject: "Eduwizer Contact Us",
          text: `Contact Person`,
          html: `Name: ${req.body.name} .  
          Email:  ${req.body.email} . 
          Message: ${req.body.message} . Phone: ${req.body.phone}`,
        };

        const messageSendData = await apiKey.send(msg);

        console.log("data", data);

        console.log("messageSendData", messageSendData);

        response = {
          success: 1,
          data: messageSendData,
          message: "Sucessfully Send Message",
        };
      } else {
        response = {
          success: 0,
          data: data,
          message: "Error While  Send Message",
        };
      }
    } catch (error) {
      console.error(error);
      response = {
        success: 0,
        data: {},
        message: error.message,
      };
    }
    return res.send(response);
  },
  getContactMessages: async (req, res) => {
    try {
      const { page, limit, search } = req.query;
      const contactMessages = await dashboardService.getContactMessages(page, limit, search);
      
      if (contactMessages && contactMessages.data !== undefined) {
        return res.status(200).json({
          success: 1,
          data: contactMessages.data,
          pagination: {
            total: contactMessages.total,
            page: contactMessages.page,
            limit: contactMessages.limit,
            pages: contactMessages.pages
          },
          message: "Successfully Fetched Contact Messages"
        });
      }
      
      res.status(200).json(contactMessages);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  },
  deleteContactMessage: async (req, res) => {
    try {
      const { id } = req.params;
      if (!id) {
        return res.status(400).json({ success: 0, message: "ID is required" });
      }
      const deleted = await dashboardService.deleteContactMessage(id);
      if (deleted) {
        res.status(200).json({ success: 1, message: "Successfully deleted contact message" });
      } else {
        res.status(404).json({ success: 0, message: "Contact message not found" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: 0, message: error.message });
    }
  }
};

module.exports = controllers;
