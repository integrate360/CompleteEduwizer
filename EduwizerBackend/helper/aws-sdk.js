const {
  S3Client,
  DeleteObjectsCommand,
  PutObjectCommandInput,
  ListObjectsCommand,
} = require("@aws-sdk/client-s3");
const { Upload } = require("@aws-sdk/lib-storage");


class Cloud {
  /**
   *
   * @param {{
   * ACCESS_KEY: string,
   * SECRET_KEY: string,
   * REGION: string,
   * BUCKET: string
   *  }} param0
   */
  constructor({ ACCESS_KEY, SECRET_KEY, REGION, BUCKET }) {
    // console.log("ACCESS_KEY, SECRET_KEY, REGION, BUCKET",ACCESS_KEY, SECRET_KEY, REGION, BUCKET)
    this.s3 = new S3Client({
      region: REGION,
      credentials: {
        accessKeyId: ACCESS_KEY,
        secretAccessKey: SECRET_KEY,
      },
    });

    this.ACCESS_KEY = ACCESS_KEY;
    this.SECRET_KEY = SECRET_KEY;
    this.REGION = REGION;
    this.BUCKET = BUCKET;

    return this;
  }

  /**
   * Upload file to S3
   * @param {PutObjectCommandInput} params
   * @returns location of the uploaded object
   */
  async uploadToS3(params) {
    params.Bucket = this.BUCKET;
    try {
      /**
       * @param {{client: S3Client}} param0
       */
      const parallelUploads3 = new Upload({
        client: this.s3,
        params,
      });
      const data = await parallelUploads3.done();
      return data.Location;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  /**
   * Delete Objects from S3
   * @param {ObjectIdentifier[]} objects
   * @returns
   */
  async deleteFromS3(objects) {
    // params.Bucket = this.BUCKET;
    try {
      const input = {
        Bucket: this.BUCKET,
        Delete: {
          Objects: objects,
        },
      };
      const command = new DeleteObjectsCommand(input);
      const response = await this.s3.send(command);
      return response;
    } catch (err) {
      console.error(err);
      throw err;
    }
  }

  /**
   *
   * @param {string} dir
   * @returns
   */
  async listObjects(dir) {
    const listParams = {
      Bucket: this.BUCKET,
      Prefix: dir,
    };

    const data = await this.s3.send(new ListObjectsCommand(listParams));

    return data;
  }

  /**
   * Invalidate the file at the given path
   * @param {string} path
   * @returns
   */
  async invalidate(path) {
    const client = new CloudFrontClient({
      credentials: {
        accessKeyId: this.ACCESS_KEY,
        secretAccessKey: this.SECRET_KEY,
      },
      region: this.REGION,
    });

    const command = new CreateInvalidationCommand({
      InvalidationBatch: {
        CallerReference: `${Date.now()}`,
        Paths: {
          Quantity: 1,
          Items: [path],
        },
      },
    });

    const response = await client.send(command);
  }
}

module.exports = new Cloud({
  ACCESS_KEY: process.env.AWS_ACCESS_KEY,
  SECRET_KEY: process.env.AWS_SECRET_KEY,
  REGION: process.env.REGION,
  BUCKET: process.env.AWS_BUCKET_NAME,
});
