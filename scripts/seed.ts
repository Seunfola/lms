const { PrismaClient } = require("@prisma/client");

const database = new PrismaClient();

async function main(){
    try {
        await database.category.createMany({
            data:[
                {value: 'Mobile Development'},
                {value: 'FrontEnd Engineering'},
                {value: 'Backend Engineering'},
                {value: 'Cloud Engineering'},
                {value: 'IT Support'},
                {value: 'UI/UX'},
                {value: 'Project Management'},
            ]
        });
        console.log("success")
    } catch (error) {
        console.log("error seeding the database category", error)
    }finally{
        await database.$disconnect();
    }
}

main();