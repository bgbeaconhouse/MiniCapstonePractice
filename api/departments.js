const express = require("express")
const router=express.Router()
router.use(express.json())

const prisma = require("../prisma");

const verifyToken = require("../verify")

// Get list of all departments
router.get("/", async (req, res, next) => {
    try {
      const departments = await prisma.department.findMany();
      res.json(departments);
    } catch {
 
      next();
    }
  });

  // Get a specific department
  router.get("/:id", async (req, res, next) => {
    try {
      const id = +req.params.id;
  
      const department = await prisma.department.findUnique({ where: { id } });
  
      if (!department) {
        return next({
          status: 404,
          message: `Could not find department with id ${id}.`,
        });
      }
  
      res.json(department);
    } catch {
      next();
    }
  });

  // Get all professors in a department
  router.get("/:id/professors", async (req, res, next) => {
    try {
      const id = +req.params.id;
  
      
      const department = await prisma.department.findUnique({ where: { id } });
      if (!department) {
        return next({
          status: 404,
          message: `Could not find department with id ${id}.`,
        });
      }
  
      const professors = await prisma.professor.findMany({ where: { departmentId: id } });
  
      res.json(professors);
    } catch {
      next();
    }
  });

  // Add a new department
  router.post("/", verifyToken, async (req, res, next) => {
    console.log("Inside the route")
    try {
    
      const { name, email, description, image } = req.body;
      console.log(req.body);
      
  
      
      if (!name) {
    
        const error = {
          status: 400,
          message: "Department must have a name.",
        };
  
       
        return next(error);
      }
      console.log("before prisma")
      const department = await prisma.department.create({ data: { name, email } });
      console.log("after create:")
      res.status(201).json(department);
    } catch {
      next();
    }
  });

  

  // Update department
  router.put("/:id", verifyToken, async (req, res, next) => {
    try {
      const id = +req.params.id;
  
      
      const departmentExists = await prisma.department.findUnique({ where: { id } });
      if (!departmentExists) {
        return next({
          status: 404,
          message: `Could not find department with id ${id}.`,
        });
      }
  
      
      const { name, email, description, image } = req.body;
      if (!name) {
        return next({
          status: 400,
          message: "Department must have a name.",
        });
      }
  
    
      const department = await prisma.department.update({
        where: { id },
        data: { name, email, description, image },
      });
  
      res.json(department);
    } catch {
      next();
    }
  });


  // Delete department
  router.delete("/:id", verifyToken, async (req, res, next) => {
    
    try {
      const id = +req.params.id;
  
      const departmentExists = await prisma.department.findUnique({ where: { id } });
      if (!departmentExists) {
        return next({
          status: 404,
          message: `Could not find department with id ${id}.`,
        });
      }
  
      await prisma.department.delete({ where: { id } });
  
      res.sendStatus(204);
    } catch {
      next();
    }
  });

  

  // Create new professor for specified department
  router.post("/:id/professors", verifyToken, async (req, res, next) => {
    try {
      const departmentId = +req.params.id;
  
      const department = await prisma.department.findUnique({ where: { id:departmentId } });
      if (!department) {
        console.log(`Department with ID ${id} not found.`);
        return next({
          status: 404,
          message: `Could not find department with id ${id}.`,
        });
      }
  
      const { name, email, } = req.body;
      if (!name) {
        return next({
          status: 400,
          message: "Professor must have a name.",
        });
      }
  
      const professor = await prisma.professor.create({
        data: { name, email, department: { connect: { id: departmentId || undefined} } },
      });
  
      res.json(professor);
    } catch (error) {
      console.error('Error in creating professor:', error);
      next(error);
    }
  });

// Remove a professor from a department
router.put("/:departmentId/remove-professor/:professorId", verifyToken, async (req, res, next) => {
  try {
    const departmentId = +req.params.departmentId;
    const professorId = +req.params.professorId;

    
    const departmentExists = await prisma.department.findUnique({
      where: { id: departmentId },
    });
    if (!departmentExists) {
      return next({
        status: 404,
        message: `Could not find department with id ${departmentId}.`,
      });
    }

   
    const professorExists = await prisma.professor.findUnique({
      where: { id: professorId },
    });
    if (!professorExists) {
      return next({
        status: 404,
        message: `Could not find professor with id ${professorId}.`,
      });
    }

    
    const updatedProfessor = await prisma.professor.update({
      where: { id: professorId },
      data: {
        departmentId: null,
      },
    });

    res.json(updatedProfessor);
  } catch (error) {
    next(error);
  }
});

  module.exports = router;