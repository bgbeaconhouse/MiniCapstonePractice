const express = require("express")
const router=express.Router()
router.use(express.json())


const prisma = require("../prisma");

const verifyToken = require("../verify")

// Get all professors
router.get("/", async (req, res, next) => {
    try {
      const professors = await prisma.professor.findMany();
      res.json(professors);
    } catch {
      next();
    }
  });

//   Get a specified professor
  router.get("/:id", async (req, res, next) => {
    try {
      const id = +req.params.id;
  
      const professor = await prisma.professor.findUnique({ where: { id } });
      if (!professor) {
        return next({
          status: 404,
          message: `Could not find professor with id ${id}.`,
        });
      }
  
      res.json(professor);
    } catch {
      next();
    }
  });

//   Get a specified professor with their department
router.get("/:id/department", async (req, res, next) => {
    try {
        const id = +req.params.id;

        const professor = await prisma.professor.findUnique({
            where: {id},
            include: {
                department: true,
            }
        });

        if (!professor) {
            return next({
                status: 404,
                message: `Could not find professor with id ${id}.`
            })
        }

        res.json(professor);
    } catch (error) {
        next(error)
    }
})
 
// Add new professor
  router.post("/", verifyToken, async (req, res, next) => {
    console.log("Inside the route")
    try {
    
      const { name, email, description, image } = req.body;
  
      
      if (!name) {
    
        const error = {
          status: 400,
          message: "Professors must have a name.",
        };
  
       
        return next(error);
      }
      console.log("before prisma")
      const professor = await prisma.professor.create({ data: { name, email, description, image } });
      res.status(201).json(professor);
    } catch {
      next();
    }
  });


// Update existing professor

router.put("/:id", async (req, res, next) => {
  try {
    const id = +req.params.id;

    const professorExists = await prisma.professor.findUnique({ where: { id } });
    if (!professorExists) {
      return next({
        status: 404,
        message: `Could not find professor with id ${id}.`,
      });
    }

    const { name, email, bio, image, department, newDepartmentId } = req.body;

  
    if (!name) {
      return next({
        status: 400,
        message: "Professor must have a name.",
      });
    }

    const dataToUpdate = { name, email, bio, image, department };

   
    if (newDepartmentId) {
      const departmentExists = await prisma.department.findUnique({
        where: { id: +newDepartmentId },
      });
      if (!departmentExists) {
        return next({
          status: 400,
          message: `Could not find department with id ${newDepartmentId}.`,
        });
      }
      dataToUpdate.departmentId = +newDepartmentId;
    }

    const updatedProfessor = await prisma.professor.update({
      where: { id },
      data: dataToUpdate,
    });

    res.json(updatedProfessor);
  } catch (error) {
    next(error);
  }
});

//   Delete specified professor
  router.delete("/:id", verifyToken, async (req, res, next) => {
    try {
      const id = +req.params.id;
      const newDepartmentId = +req.params.newDepartmentId;

      const professorExists = await prisma.professor.findUnique({ where: { id } });
      if (!professorExists) {
        return next({
          status: 404,
          message: `Could not find professor with id ${id}.`,
        });
      }
  
      await prisma.professor.delete({ where: { id } });
  
      res.sendStatus(204);
    } catch {
      next();
    }
  });

  
module.exports = router;