const prisma = require("../prisma");
const seed = async () => {
 
  const createDepartments = async () => {
    const departments = [
        {name: "English", description: "study of literature, writing, and language.", image: "https://example.com/english.jpg", email: "english@university.edu" },

        {name: "Math", description: "Mathematics: algebra, calculus, and beyond.", image: "https://example.com/math.jpg", email: "math@university.edu",},
        {name: "Science", description: "Explore biology, chemistry, and physics.", image: "https://example.com/science.jpg", email: "science@fullstack.edu",},
        {name: "History", description: "Dive into world, US, and ancient history.", image: "https://example.com/history.jpg", email: "history@fullstack.edu"},
        {name: "Latin", description: "Learn the classical Latin language and culture.", image: "https://example.com/latin.jpg", email: "latin@fullstack.edu"},

    ]
    await prisma.department.createMany({data: departments});
  };

  const createProfessors = async () => {
    const professors = [
        {name: "Dr. Wilkins", departmentId: 1, email: "wilkins@fullstack.edu", image: "https://example.com/wilkins.jpg", bio: "Been a professor for the past 14 years." },
        {name: "Dr. Salsberry", departmentId: 1, email: "salsberry@fullstack.edu", image: "https://example.com/salsberry.jpg", bio: "Been a professor for the past 15 years." },
        {name: "Dr. Jenkins", departmentId: 2, email: "jenkins@fullstack.edu", image: "https://example.com/jenkins.jpg", bio: "Been a professor for the past 16 years." },
        {name: "Dr. Santana", departmentId: 2, email: "santana@fullstack.edu", image: "https://example.com/santana.jpg", bio: "Been a professor for the past 17 years." },
        {name: "Dr. Kilman", departmentId: 3, email: "kilman@fullstack.edu", image: "https://example.com/kilman.jpg", bio: "Been a professor for the past 18 years." },
        {name: "Dr. Herot", departmentId: 3, email: "herot@fullstack.edu", image: "https://example.com/herot.jpg", bio: "Been a professor for the past 19 years." },
        {name: "Dr. Pinkman", departmentId: 4, email: "pinkman@fullstack.edu", image: "https://example.com/pinkman.jpg", bio: "Been a professor for the past 20 years." },
        {name: "Dr. Hublot", departmentId: 4, email: "hublot@fullstack.edu", image: "https://example.com/hublot.jpg", bio: "Been a professor for the past 21 years." },
        {name: "Dr. Kerry", departmentId: 5, email: "kerry@fullstack.edu", image: "https://example.com/kerry.jpg", bio: "Been a professor for the past 22 years." },
        {name: "Dr. Thomas", departmentId: 5, email: "thomas@fullstack.edu", image: "https://example.com/thomas.jpg", bio: "Been a professor for the past 23 years." },
    ]
        await prisma.professor.createMany({data: professors})
  }

  const createAdministrators = async () => {
    const administrators = [
      {username: "schoolboy1", password: "iloveschool"},
      {username: "universitydude2", password: "schoolrocks"},
      {username: "collegekid3", password: "lovecollege"},
    ]
    await prisma.administrator.createMany({data: administrators})
  }

  await createDepartments();
  await createProfessors();
  await createAdministrators();
};
seed()
  .then(async () => await prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });