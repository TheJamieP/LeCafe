type Car = {
    images: object
}

export default async (message: any, args: string[]): Promise<void> => {
    if (!args) return message.reply("Please include a valid vehicle name, e.g: $fetchcar adder");

    let Car: string = args[0];
    

    fetch(`https://gta.vercel.app/api/vehicles/${Car.toLowerCase()}`, {
        "method": "GET"
    }).then((res) => res.json() as Promise<Car>).then( async (res: Car) => {
        if (!res) return;
        Object.values(res.images).forEach(async (image:string) => {
            await message.channel.send(image);
        })
    }).catch(async (err) => {
        await message.reply("Please include a valid vehicle name, e.g: $fetchcar adder")
    })

};