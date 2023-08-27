const notFound = (req,res)=> {
    res.status(400).json("Route does not Exist");
}

export default notFound;