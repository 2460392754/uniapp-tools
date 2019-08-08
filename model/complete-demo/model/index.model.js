import Model from '../plugins/model'

let model = new Model({
    id: {
        type: Number,
        property: "uuid",
        value: 1000
    },
    name: {
        type: String,
        property: "author.nickname",
    },
    age: {
        type: Number,
        property: 'author.age',
        value: 18
    },
    birthday: {
        type: String,
        property: 'author.birthday',
        value: '01-01(default)'
    },
    email: {
        type: String,
        property: 'author.email.qq',
    },
});

// let modelParse = model.parse({
//     uuid: 13085,
//     author: {
//         nickname: 'pocky',
//         age: 20,
//     }
// });

// let modelTravers = model.traverse({
//     id: 22,
//     email: "2460392754@qq.com",
// })

// console.log(modelParse) // {"id":13085,"name":"pocky","age":20,"birthday":"01-01(default)","email":""}
// console.log(modelTravers) // {"uuid":22,"author":{"nickname":"pocky","age":20,"birthday":"01-01(default)","email":{"qq":"2460392754@qq.com"}}}
 
export default model;