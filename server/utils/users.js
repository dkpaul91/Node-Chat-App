[{
    id: '',
    name: '',
    room: ''
}]

class Users {
    constructor () {
        this.users = [];
    }
    addUser (id, name, room) {
        var user = {id, name, room};
        this.users.push(user);
        return user;
    }
    removeUser (id) {
//        var index;
//        var user = this.users.filter((user, i) => {
//            if(user.id === id) {
//                index = i;                
//            }
//            return user.id === id;
//        });
//        (index) && this.users.splice(index, 1);
        var user = this.getUser(id);
        
        if (user) {
            this.users = this.users.filter((user) => user.id !== id);
        }
        
        return user;
    }
    getUser (id) {
        return this.users.filter((user) => user.id === id)[0];
    }
    getUserList (room) {
        var users = this.users.filter((user) => user.room === room);
        var namesArray = users.map((user) => user.name);
        
        return namesArray;
    }
    getUserByName (name) {
        return this.users.filter((user) => user.name === name)[0];
    }
    getActiveRoomList () {
        return Array.from(new Set(this.users.map((user) => user.room)));
    }
}

//class Person {
//    constructor (name, age) {
//        this.name = name;
//        this.age = age;
//    }
//    getUserDescription () {
//        return `${this.name} is ${this.age} year(s) old.`;
//    }
//}
//
//var me = new Person('Dwip', 26);
//var description = me.getUserDescription();
//console.log(description);


 module.exports = {Users};