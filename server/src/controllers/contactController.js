import ContactMessage from '../models/ContactMessage.js';

// @desc    Handle contact form submission
// @route   POST /api/contact
// @access  Public
export const submitContactForm = async (req, res) => {
  try {
    const { name, email, message } = req.body;

    // Note: Input validation is already handled by express-validator middleware
    // The validation middleware runs BEFORE this controller

    // Save to database
    const contactMessage = await ContactMessage.create({
      name,
      email,
      message,
    });

    console.log(`📧 New contact form submission from ${email}`);

    res.status(201).json({
      success: true,
      message: 'Message received successfully!',
      data: {
        id: contactMessage._id,
        name: contactMessage.name,
        email: contactMessage.email,
        message: contactMessage.message,
        createdAt: contactMessage.createdAt,
      },
    });
  } catch (error) {
    console.error('Error saving contact message:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to save message. Please try again later.',
    });
  }
};

// @desc    Get all contact messages (admin only)
// @route   GET /api/contact
// @access  Private (Admin only)
export const getAllContactMessages = async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });

    const summary = {
      total: messages.length,
      unread: messages.filter((m) => !m.read).length,
      read: messages.filter((m) => m.read).length,
    };

    res.json({
      success: true,
      data: messages,
      summary,
    });
  } catch (error) {
    console.error('Error fetching contact messages:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch messages',
    });
  }
};

// @desc    Mark contact message as read/unread
// @route   PATCH /api/contact/:id
// @access  Private (Admin only)
export const markMessageAsRead = async (req, res) => {
  try {
    const { id } = req.params;
    const { read } = req.body;

    const message = await ContactMessage.findById(id);

    if (!message) {
      return res.status(404).json({
        success: false,
        error: 'Message not found',
      });
    }

    message.read = read;
    message.readAt = read ? new Date() : null;
    await message.save();

    res.json({
      success: true,
      data: message,
    });
  } catch (error) {
    console.error('Error updating message:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to update message',
    });
  }
};

// @desc    Delete contact message
// @route   DELETE /api/contact/:id
// @access  Private (Admin only)
export const deleteContactMessage = async (req, res) => {
  try {
    const { id } = req.params;

    const message = await ContactMessage.findByIdAndDelete(id);

    if (!message) {
      return res.status(404).json({
        success: false,
        error: 'Message not found',
      });
    }

    res.json({
      success: true,
      message: 'Message deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting message:', error.message);
    res.status(500).json({
      success: false,
      error: 'Failed to delete message',
    });
  }
};
