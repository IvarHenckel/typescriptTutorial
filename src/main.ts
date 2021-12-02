const a = "1";
console.log('aaa', a); // normal console println


/* In JS we define variables with var const and let:
var declarations are globally scoped or function scoped while let and const are block scoped. 
var variables can be updated and re-declared within its scope; 
let variables can be updated but not re-declared; 
const variables can neither be updated nor re-declared. They are all hoisted to the top of their scope.
*/
const hello = "world" // Although statically typed, types can be inferred just like in scala so : string can be skipped altough I prefer using it.
// You can see by the VSCode type highlight that hello gets type hello: "world"
// If it was a var or let it would get type string but consts are treated differently since they cannot change so they don't need the same type of type checking
// The guy in the video also recommends explicetly specifying the types
// He also says that he recommends using const or let over vars

// A function
// If we don't give any explicit types to the parameters and return types the compiler whill just infer type any (then we are basically back at JS)
const getFullName = (name: string, surname: string): string => {
    return name + ' ' + surname;
}
// U can also use 
const getHalfName = function (name: string, surname: string) {
    return name;
} 
//The guy in the video says that it doesn't make much sense to use the function keyword 
//Since => is faster and easier to write 

console.log(getFullName("Jonas", "Skeppstedt"));

// JS object
const user = {
    name: 'Monster', // Note attributes of an object are comma separated. I think a JS object is basically treated like a HashMap
    age: 32
}
// one way to add type, but if we want to use the same type of object we will have to copy pastea these types to everywhere
const user2: {name: string, age: number} = {
    name: "Jack",
    age: 32
}
// Another way which is better if we have multiple Users
interface UserInterface { // Note interface is not just about functions like in Java
    //Note: interfaces are usually named either IUser or UserInterface  (i.e. not just User) to be able to differ them from classes
    name: string;
    age: number;
    isPrimeMember?: boolean; // ? between name and ':' means that the attribute is not mandatory

    getMessage(): string;
}
const user3: UserInterface = {
    name: 'Monster',
    age: 32,
    getMessage() {
        return 'Hello' + name;
    }
}

console.log(user3.getMessage());

let pageNumber: string | number = "1"; //"|" is called the union operator -> pageNumber can be either string or number

let errorMessage: string | null = null; // This is a common use case of union
// without using null the default would be undefined 
// The guy in the video highly recommends to always use default values if possible

let user4: UserInterface | null = null;
// Don't get carried away with to many unions!

type NullableString = string | null;// type alias, just like in Scala and C

const doSomething = (): void => {
    console.log("doSomething");
}

const weirdConst: void = null; // void is a set of null and undefined, no other values are legal here
// Of course this variable makes no sense 

//In typescript we don't like the any type, after all the purpose is to get rid of it
//With any TS can't use any static typecheck
let foo: any = 'foo';

// Never is acceptable but it's not that useful
const doSomethingFoverever = (): never => {
    // With never we are not allowed to get to the end of this function
    // while (true) {
    //  //infinite loop is also valid   
    // }
    throw "never"; // This way we will never get to the end of this function
}

//unknown is a better alternative for any. It gets it's typ when first assigned, but it can't change later
let vAny: any = 10;
let vUnknown: unknown = 10;
let s1: string = vAny; // this works    
//let s2: string = vUnknown;  This would give error
//let s3: number = vUnknown; doesn't work either
let s4: unknown = vUnknown; // works

//for unknown to really be usefull we need "type assertion" which is like casting
let s2: string = vUnknown as string;

let someString: string = "1";
let someNumber: number = (someString as unknown) as number;
// For some reason we need to convert to unknown first (?)

// Altough we don't like any we can't avoid them completely since they sometimes come from libraries
// I should probably look into DOM objects to see what it is?
// He explains it like something I should know from JS
// He also points out that TS doesn't see markup at all
// (markup = HTML or XML etc)
// therefore we have to provide type information for typescript
const someElement = document.querySelector(".foo");
console.log("someElement", (someElement as any).value); // This is a bad solution

const someBetterElement = document.querySelector(".foo") as HTMLInputElement;
console.log("someElement", someBetterElement.value); // HTMLInputElement has value but it is not at all as high up the type hierarchy

someElement.addEventListener('blur', (event) => {
    const target = event.target as HTMLInputElement
    console.log('event', target.value);
});

//ES6 and forward there is support for classes in JS.
//TS always has classes
// We can also use private, public and protected like in java. One difference is that default is public.
// We use implement for interfaces like in java
interface AnInterface {
    getFullName(): string;
}
class User implements AnInterface {
    protected firstName: string;
    protected lastName: string;

    readonly unchangableName: string; // readonly is like final <=> can only be set once.
    //Skillnad const vs unchangableName
    //klassmedlemmar kan inte ha var, let, const.
    //Dessutom sätts readonly senare som i konstruktorn här, medan const tilldelas vid deklaration.
    //Const, let och var är väl globala variabler i static storage duration
    // medan (ej static) klassmedlemmar allokeras på heapen med klassen.
    constructor(firstName: string, lastName: string) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.unchangableName = "Kurt Kurre Karlsson";
    }

    public getFullName(): string {
        return this.firstName + ' ' + this.lastName;
    }

    static readonly maxAge = 50;
}

const user42 = new User("Goran", "Hedin") // Also new just like in Java
console.log(user42.getFullName());

// extends also works like in Java
class Admin extends User {
    private editor: string = "the idiot";
    setEditor(editor: string): void {
        this.editor = editor;
    }

    getEditor(): string {
        return this.editor; // One difference is that we always need to refer to editor with this.editor. Only editor like in java doesn't work.
    }

    // seems like override can be excluded but not completely sure
    override getFullName(): string {
      return this.firstName + this.editor + this.lastName;  
    }
}

const admin = new Admin("Adelaida", "Dostojevsky")
admin.setEditor("Senap");
console.log(admin.getFullName());


const addId = <T extends object>(obj: T) => {
    //By using generic types with type parameters object won't be any
    // but instead it will be the type that we passed in.
    // Here we have also set the constraint that T must be of a subtype to object. I.e we can't pass in string or number
    const id = Math.random().toString(16);
    return { // This is a way to merge objects
        ...obj,
        id
    };
};

const anotherUser = {
    name: "Jula"
};

const result = addId(anotherUser);
console.log("result is ", result);

//we can be more precise to allow for better type checking
interface UserInterface2 {
    name: string;
}
const anotherUser2: UserInterface2 = {
    name: "Biltema"
}
const result2 = addId<UserInterface2>(anotherUser2); 
//Things worked before cause TS automatically inserts type {name:string} as <T> but it is better to be explicit.
// Note that {name:string} is a type

interface ListNodeInterface<T> {
    data: T;
    next: ListNodeInterface<T> | null;
}

const list:ListNodeInterface<{meta:string}> = {
    data: {meta:"gurk"},
    next: null
}

const anotherList:ListNodeInterface<string[]> = {
    data: ["Malec", "Jacek", "Stanislav"],
    next: null
}

// if we want to we can simply provide several generic types with comma <T, V>

//Han pratar om enums men jag skippar det. Känns inte som att det lär vara nödvändigt.

// In javascript nested functions is not a problem

// In JS all declarations are handled first
// But all assignments etc are handled from top to bottom.
testing = 3;
console.log(testing);
var testing: number; // note number is either integer or double
//The above will print out 3. If testing = 3 was moved down we would have printed undefined.