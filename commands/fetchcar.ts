type Car = {
    images: object
}

export default async (message: any, args: string[]): Promise<void> => {
    if (!args) return message.reply("Please include a valid vehicle name, e.g: $fetchcar adder");

    let car: string = "";
    if (args.length > 1) args.forEach((word: string) => {car += args.indexOf(word) != args.length ? `${word} ` : word})
    else car = args[0]


    const R = fetch(`localhost:3022/api/image/?car=${car.toLowerCase()}`, {method: "GET"})
    .then(async (res) => {
        return res.json()
    })
    .then( async (res: any) => {
        if (res.Links) return res.Links.forEach(async (L:string ) => {await message.channel.send(L)});
    }).catch(async (err: Error) => {
        if (err.message.toLowerCase() != "failed to parse to json") return await message.reply("Please include a valid vehicle name, e.g: $fetchcar adder");

        
    })

    
    await R

};