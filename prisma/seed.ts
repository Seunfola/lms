const { PrismaClient } = require("@prisma/client");

const database = new PrismaClient();

async function main(){
    try {
        await database.category.createMany({
            data:[
                {name: 'Web-Development'},
                {name: 'Robotics'},
                {name: 'Data-Analysis'},
                {name: 'Cloud-Engineering'},
                {name: 'IT-Support'},
                {name: 'UI/UX'},
                {name: 'Project-Management'},
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