// In a real app, you would fetch this data from the database.
// For now, we'll use a static array of projects.
const sampleProjects = [
  {
    _id: '1',
    title: 'Interactive Portfolio Website',
    description:
      'A personal portfolio showcasing creative development skills with interactive animations and a modern design.',
    imageUrl: 'https://via.placeholder.com/400x250/FF5733/FFFFFF?text=Project+1',
    projectUrl: 'https://github.com/yourusername/project1',
    tags: ['React', 'Tailwind CSS', 'Framer Motion', 'Vite'],
  },
  {
    _id: '2',
    title: 'E-commerce Storefront',
    description:
      'A full-stack e-commerce application with product listings, shopping cart functionality, and user authentication.',
    imageUrl: 'https://via.placeholder.com/400x250/33FF57/FFFFFF?text=Project+2',
    projectUrl: 'https://github.com/yourusername/project2',
    tags: ['MERN Stack', 'Redux', 'Stripe API'],
  },
  {
    _id: '3',
    title: 'Real-time Chat Application',
    description:
      'A real-time chat application built with WebSockets, allowing users to communicate in various rooms.',
    imageUrl: 'https://via.placeholder.com/400x250/3357FF/FFFFFF?text=Project+3',
    projectUrl: 'https://github.com/yourusername/project3',
    tags: ['Node.js', 'Express', 'Socket.io', 'React'],
  },
  {
    _id: '4',
    title: 'Task Management Tool',
    description:
      'A simple and intuitive task management application to help users organize their daily tasks and boost productivity.',
    imageUrl: 'https://via.placeholder.com/400x250/FF33A1/FFFFFF?text=Project+4',
    projectUrl: 'https://github.com/yourusername/project4',
    tags: ['React', 'Context API', 'CSS Modules'],
  },
  {
    _id: '5',
    title: 'Weather Dashboard',
    description:
      'A weather application that displays current weather conditions and forecasts for any city using a third-party API.',
    imageUrl: 'https://via.placeholder.com/400x250/A1FF33/FFFFFF?text=Project+5',
    projectUrl: 'https://github.com/yourusername/project5',
    tags: ['React', 'API Integration', 'Axios'],
  },
  {
    _id: '6',
    title: 'Project One',
    description: 'This is the description for project one.',
    imageUrl: 'https://via.placeholder.com/300',
    projectUrl: '#',
    tags: ['React', 'Node.js', 'Web Design'],
  },
  {
    _id: '7',
    title: 'Project Two',
    description: 'This is the description for project two.',
    imageUrl: 'https://via.placeholder.com/300',
    projectUrl: '#',
    tags: ['Vue', 'Firebase', 'Animation'],
  },
];

// @desc    Get all projects
// @route   GET /api/projects
// @access  Public
export const getProjects = (req, res) => {
  // Later, this will be:
  // const projects = await Project.find();
  res.json(sampleProjects);
};
