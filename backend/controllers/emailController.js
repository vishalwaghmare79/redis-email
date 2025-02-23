const fs = require("fs");
const { Email } = require("../models/email.model");
const { User } = require("../models/user.model");
const emailQueue = require("../helpers/emailQueue");

const sendEmails = async (req, res) => {
  const sender = req.user._id;
  const user = await User.findById(sender).select("email").lean();
  const userEmail = user.email;

  const { recipients, subject, content } = req.body;
  if (!recipients || !subject || !content) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    const recipientList = JSON.parse(recipients);

    const attachments = [];
    if (req.file) {
      const fileData = fs.readFileSync(req.file.path);
      attachments.push({
        content: fileData.toString("base64"),
        filename: req.file.originalname,
        type: req.file.mimetype,
        disposition: "attachment",
      });
      fs.unlinkSync(req.file.path);
    }

    const emails = recipientList.map((recipient) => ({
      to: recipient.email,
      from: userEmail,
      subject,
      text: content.replace("{name}", recipient.name),
      attachments,
    }));

    const savedEmails = await Promise.all(
      recipientList.map(async (recipient) => {
        const text = content.replace("{name}", recipient.name);
        const emailEntry = new Email({
          name: recipient.name,
          email: recipient.email,
          subject,
          content: text,
          sender,
          status: "pending",
        });
        return emailEntry.save();
      })
    );

    const jobs = emails.map((email, index) => {
      const jobData = {
        emails: [{
          ...email,
          emailId: savedEmails[index]._id,
        }],
      };
      console.log("Adding job to queue:", jobData);
      return emailQueue.add(jobData);
    });

    res.status(200).json({ message: "Emails queued successfully", savedEmails });
  } catch (error) {
    console.error("Error queuing emails:", error);
    res.status(500).json({ message: "Error queuing emails", error });
  }
};


const getEmails = async (req, res) => {
  const sender = req.user._id;
  try {
    const emails = await Email.find({sender}).sort({ createdAt: -1 });
    res.status(200).json({ success: true, emails });
  } catch (error) {
    console.error("Error fetching emails:", error);
    res
      .status(500)
      .json({ success: false, message: "Error fetching emails", error });
  }
};

const getEmailById = async (req, res) => {
  try {
    const { id } = req.params; 
    const email = await Email.findById(id);

    if (!email) {
      return res
        .status(404)
        .json({ success: false, message: "Email not found" });
    }

    res.status(200).json({ success: true, email });
  } catch (error) {
    console.error("Error fetching email:", error);
    res
      .status(500)
      .json({ success: false, message: "Error fetching email", error });
  }
};

const deleteEmailById = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedEmail = await Email.findByIdAndDelete(id);

    if (!deletedEmail) {
      return res
        .status(404)
        .json({ success: false, message: "Email not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Email deleted successfully", deletedEmail });
  } catch (error) {
    console.error("Error deleting email:", error);
    res
      .status(500)
      .json({ success: false, message: "Error deleting email", error });
  }
};


module.exports = { sendEmails, getEmails, getEmailById, deleteEmailById };
