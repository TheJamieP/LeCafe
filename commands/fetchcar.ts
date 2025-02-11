type Car = {
    images: object
}

export default async (message: any, args: string[]): Promise<void> => {
    if (!args) return message.reply("Please include a valid vehicle name, e.g: $fetchcar adder");

    console.log(args)
    
    let car: string = "";
    if (args.length > 1) args.forEach((word: string) => {car += args.indexOf(word) != args.length ? `${word} ` : word})
    else car = args[0]

    fetch(`https://gta.vercel.app/api/vehicles/${car.toLowerCase()}`, {
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