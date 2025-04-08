const prisma = require("../prisma");
const seed = async () => {
 
  const createDepartments = async () => {
    const departments = [
        {name: "English", description: "study of literature, writing, and language.", image: "https://ecdn.teacherspayteachers.com/thumbuserbig/The-English-Department-1742986894/1999397.jpg", email: "english@university.edu" },

        {name: "Math", description: "Mathematics: algebra, calculus, and beyond.", image: "https://3.files.edl.io/28b4/24/05/14/101957-2a1111ff-de24-437d-94f9-28123d992469.png", email: "math@university.edu",},
        {name: "Science", description: "Explore biology, chemistry, and physics.", image: "https://i0.wp.com/www.woodgreenacademy.co.uk/wp-content/uploads/2022/08/science.jpg?fit=800%2C445&ssl=1", email: "science@fullstack.edu",},
        {name: "History", description: "Dive into world, US, and ancient history.", image: "https://www.oxnardcollege.edu/sites/oxnardcollege/files/departments/academic/history/his-banner_1.jpg", email: "history@fullstack.edu"},
        {name: "Latin", description: "Learn the classical Latin language.", image: "https://www.livelylatin.com/assets/Screen-Shot-2013-03-12-at-4.31.37-PM.png", email: "latin@fullstack.edu"},

    ]
    await prisma.department.createMany({data: departments});
  };

  const createProfessors = async () => {
    const professors = [
        {name: "Dr. Wilkins", departmentId: 1, email: "wilkins@fullstack.edu", image: "https://cdn.mos.cms.futurecdn.net/Wb27o4U7hX46gbfwRk8QzC-415-80.jpg", bio: "Been a professor for the past 14 years." },
        {name: "Dr. Salsberry", departmentId: 1, email: "salsberry@fullstack.edu", image: "https://images.squarespace-cdn.com/content/v1/624f4bb135fbf60489e1bccf/c97c249c-eef3-402f-bacb-de2e52e2d8be/Jay+Ellis+actor+headshotsjpgweb.jpg", bio: "Been a professor for the past 15 years." },
        {name: "Dr. Jenkins", departmentId: 2, email: "jenkins@fullstack.edu", image: "https://cdn.mos.cms.futurecdn.net/QJ9CvDtgcH7e9KJ6rdcJYV-415-80.jpg", bio: "Been a professor for the past 16 years." },
        {name: "Dr. Santana", departmentId: 2, email: "santana@fullstack.edu", image: "https://static.wixstatic.com/media/bba34b_652a4957dc2f4172968ea1eefebb2fdf~mv2.png/v1/fill/w_600,h_900,al_c,q_90,enc_avif,quality_auto/bba34b_652a4957dc2f4172968ea1eefebb2fdf~mv2.png", bio: "Been a professor for the past 17 years." },
        {name: "Dr. Kilman", departmentId: 3, email: "kilman@fullstack.edu", image: "https://i.pinimg.com/736x/29/24/66/2924661f65fc2d596186f7507231be01.jpg", bio: "Been a professor for the past 18 years." },
        {name: "Dr. Herot", departmentId: 3, email: "herot@fullstack.edu", image: "https://www.headshotphoto.io/images/blogs/denzel-washington.webp", bio: "Been a professor for the past 19 years." },
        {name: "Dr. Pinkman", departmentId: 4, email: "pinkman@fullstack.edu", image: "https://cdn.mos.cms.futurecdn.net/ehXkSQ9ZBS2fpkrbXqDXyD-415-80.jpg", bio: "Been a professor for the past 20 years." },
        {name: "Dr. Hublot", departmentId: 4, email: "hublot@fullstack.edu", image: "https://i.pinimg.com/736x/93/a4/1b/93a41b57fb4d0b22158d1a0476890336.jpg", bio: "Been a professor for the past 21 years." },
        {name: "Dr. Kerry", departmentId: 5, email: "kerry@fullstack.edu", image: "https://s2.r29static.com/bin/entry/79c/0,0,460,552/720x864,85/1302249/image.webp", bio: "Been a professor for the past 22 years." },
        {name: "Dr. Thomas", departmentId: 5, email: "thomas@fullstack.edu", image: "https://images.squarespace-cdn.com/content/v1/624f4bb135fbf60489e1bccf/9d0e9b5f-5dc4-4248-9d05-b1f28f0dd4c6/Los+Angeles+headshot+photography+near+North+Hollywood+and+Studio+City.jpg", bio: "Been a professor for the past 23 years." },
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