import { AxiosInstance } from "axios";
import { GoogleAuth } from "google-auth-library";
import _ from "lodash";

export class FCMService {
  constructor(
    private readonly keyFile: string,
    private readonly url: string,
    private readonly axios: AxiosInstance
  ) {}

  async getAccessToken() {
    const auth = new GoogleAuth({
      keyFile: this.keyFile,
      scopes: ["https://www.googleapis.com/auth/firebase.messaging"],
    });

    const client = await auth.getClient();
    const accessToken = await client.getAccessToken();
    return accessToken.token;
  }

  async sendFCMMessage(title: string, body: any, deviceId: string) {
    const accessToken = await this.getAccessToken();
    const message: any = {
      message: {
        notification: { title, body },
      },
    };

    if (deviceId && deviceId !== "topic") {
      message.message.token = deviceId;
    } else {
      message.message.topic = "incoming-message";
    }

    const url = this.url || "";
    const response = await this.axios
      .post(url, message, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      })
      .catch((e) => {
        const msg = _.get(e, 'response.data.error.message');
        throw msg;
      });

    return response;
  }
}
