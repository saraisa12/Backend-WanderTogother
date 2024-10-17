const mongoose = require("mongoose")

//MangoDB Connection

mongoose
  .connect(process.env.MangoDBURL)
  .then(() => {
    console.log("mangoDB connected")
    const db = mongoose.connection
    console.log(
      `mango db connected to DataBase : ${db.name} at host : ${db.host} on port: ${db.port}`
    )
  })
  .catch((err) => {
    console.log("not connected " + err)
  })
