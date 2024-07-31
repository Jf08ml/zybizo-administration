import axios from 'axios';
require('dotenv').config();

class EmailService {
  constructor() {
    this.apiUrl = process.env.EMAIL_SERVICE_URL;
  }

  async sendEmail({ to, subject, htmlContent, fromName = 'Default Sender' }) {
    try {
      const response = await axios.post(this.apiUrl, {
        to,
        subject,
        htmlContent,
        fromName
      });
      return response.data;
    } catch (error) {
      throw new Error('Error sending email');
    }
  }
}

export default new EmailService();
