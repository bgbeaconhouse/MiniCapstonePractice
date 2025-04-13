const express = require("express")
const router=express.Router()
router.use(express.json())


const prisma = require("../prisma");

const verifyToken = require("../verify")

// Get all professors
router.get("/", async (req, res, next) => {
    try {
      const professors = await prisma.professor.findMany({
        include: { 
          department: {
            select: {
              name: true,
              id: true,
            },
          },
        },
      });
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
    
      const { name,  email, image, bio, departmentId } = req.body;
  
      
      if (!name) {
    
        const error = {
          status: 400,
          message: "Professors must have a name.",
        };
  
       
        return next(error);
      }
      console.log("before prisma")
      const professor = await prisma.professor.create({
         data: { name, email, image, bio, departmentId,

          },
        include: {
          department: {
            select: {
              name: true,
              id: true,
            }
          }
        }
        });
      res.status(201).json(professor);
    } catch(err) {
      console.error("Error in POST /api/professors:", err);
      next(err);
    }
  });


// Update existing professor

router.put("/:id", verifyToken, async (req, res, next) => {
  try {
    const id = +req.params.id;

    
    const professorExists = await prisma.professor.findUnique({ where: { id } });
    if (!professorExists) {
      return next({
        status: 404,
        message: `Could not find professor with id ${id}.`,
      });
    }

    
    const { name, email, bio, image, departmentId } = req.body;
    if (!name) {
      return next({
        status: 400,
        message: "Professor must have a name.",
      });
    }

    const professor = await prisma.professor.update({
      where: { id },
      data: { name, email, bio, image, departmentId },
      include: { 
        department: {
          select: {
            name: true,
            id: true,
          },
        },
      },
    });

    res.json(professor);
  } catch {
    next();
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

  // change department an existing professor belongs to

router.put("/:professorId/change-department/:newDepartmentId", verifyToken, async (req, res, next) => {
  try {
    const professorId = +req.params.professorId;
    const newDepartmentId = +req.params.newDepartmentId;

    
    const professorExists = await prisma.professor.findUnique({
      where: { id: professorId },
    });
    if (!professorExists) {
      return next({
        status: 404,
        message: `Could not find professor with id ${professorId}.`,
      });
    }

    
    const departmentExists = await prisma.department.findUnique({
      where: { id: newDepartmentId },
    });
    if (!departmentExists) {
      return next({
        status: 404,
        message: `Could not find department with id ${newDepartmentId}.`,
      });
    }

    
    const updatedProfessor = await prisma.professor.update({
      where: { id: professorId },
      data: {
        departmentId: newDepartmentId,
      },
    });

    res.json(updatedProfessor);
  } catch (error) {
    next(error);
  }
});

  
module.exports = router;