const mongoose = require('mongoose')

let viewRecords = false

if (process.argv.length<5) {
    if(process.argv.length===3){
        viewRecords = true
    }
    else{
        console.log('missing required arguments, run command:\n node index.js <password> \"<name>\" <phone>')
        process.exit(1)
    }
}

const password = process.argv[2]
const name = process.argv[3]
const phone = process.argv[4]

const url =
    `mongodb+srv://adizafri:${password}@irminsul.dqxayxe.mongodb.net/phonebookApp?retryWrites=true&w=majority`

mongoose.set('strictQuery',false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Person = mongoose.model('Person', personSchema)

const person = new Person({
    name: name,
    number: phone
})

if(!viewRecords){
    person.save().then(result => {
        console.log(`added ${name} number ${phone} to phonebook`)
        mongoose.connection.close()
    })
}
else{
    Person.find({}).then(result => {
    result.forEach(person => {
        console.log(person)
    })
    mongoose.connection.close()
})
}


