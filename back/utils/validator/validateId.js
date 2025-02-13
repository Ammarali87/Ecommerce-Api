import { check} from "express-validator";
import validationMiddleware from "../../middleware/validationMiddleware.js";

 const validateId = [
 check("id").isMongoId().withMessage("Invalid ID"),
    validationMiddleware
 ]
 export default validateId