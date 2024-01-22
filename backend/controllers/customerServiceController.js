import CustomerService from "../models/customerServiceModel.js";

// Handle POST request to save customer service report
const sendReport = async (req, res) => {
    try {
      const { option, subject, description } = req.body;

          // Check if the required fields are provided in the request body
      if (!option || !subject || !description) {
          return res.status(400).json({ error: "Invalid request. Please provide valid option, subject, and description." });
      }
      const username = req.user.username;
      const email = req.user.email;

      // Create a new customer service report instance
      const customerServiceReport = new CustomerService({
          username: username,
          email: email,
          reportType: option,
          subject,
          description,
      });

      // Save the report to the database
      await customerServiceReport.save();

      res.status(200).json({ message: "Customer service report submitted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
};


const getReports = async (req, res) => {
    try {
        const reports = await CustomerService.find();

        res.status(200).json(reports);
    }catch(error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export { sendReport, getReports };