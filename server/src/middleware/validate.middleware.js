export const validate = (schema) => (req, res, next) => {
  const result = schema.safeParse(req.body);

//Returns error if validation fails
  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;
    return res.status(400).json({ message: "Validation failed", errors });
  }

//Gives back cleaned date
  req.body = result.data;
  next();
};