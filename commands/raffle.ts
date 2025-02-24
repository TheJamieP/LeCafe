import {readFileSync, writeFileSync, appendFileSync, existsSync, readdirSync} from 'fs';

export default async (message: any, args: string[]): Promise<void> => {
    if (!args && !args[1]) return message.reply("Usage: $raffle [ADD/VIEW/DUMP]");
    let cmd, raffle; var filePath:string;
    cmd = args[0];
    switch(cmd.toLowerCase()){
        case 'add':
            try{
                raffle = args[1].toLowerCase()
                filePath = `/home/jamie/projects/leCafe/data/${raffle}Raffle.txt`;
            
            } catch(e){
                return message.reply("Please include a valid name and amount, Usage: $raffle [ADD] [RAFFLENAME] [NAME] [AMOUNT]");
            }
            if (!args[2] || !args[3]) return message.reply("Please include a valid name and amount, Usage: $raffle [ADD] [RAFFLENAME] [NAME] [AMOUNT]");
            while (!existsSync(filePath)) writeFileSync(filePath,"");
            for (var i = 0; i < parseInt(args[3]); i++) appendFileSync(filePath, args[2] + `\n`);

            await message.reply(`Added ${args[3]} tickets for ${args[2]}`)
            return;

        case 'view':
            var obj: { [key: string]: number } = {};
            try{
                raffle = args[1].toLowerCase()
                filePath = `/home/jamie/projects/leCafe/data/${raffle}Raffle.txt`;
            
            } catch(e){
                return message.reply("Please include a valid name and amount, Usage: $raffle [ADD] [RAFFLENAME] [NAME] [AMOUNT]");
            }
            readFileSync(filePath, {encoding: 'utf-8'}).split("\n").forEach((line) => {
                if (!line) return;
                if (obj[`${line}`]) obj[`${line}`]++; 
                else obj[`${line}`] = 1;
                
            })
            console.log(obj)
            let outputString = ``;
            Object.keys(obj).forEach((k: string) => {
                if (!obj) return;
                if (outputString === ``) outputString = `${k}, ${obj[k]} `
                else outputString += `${k}, ${obj[k]} `
            })
            if (!outputString) return;
            return message.reply(outputString);

        case 'dump':
            try{
                raffle = args[1].toLowerCase()
                filePath = `/home/jamie/projects/leCafe/data/${raffle}Raffle.txt`;
            
            } catch(e){
                return message.reply("Please include a valid name and amount, Usage: $raffle [ADD] [RAFFLENAME] [NAME] [AMOUNT]");
            }
            return await message.channel.send({files: [filePath]})
            
        case 'expected':
            filePath = `/home/jamie/projects/leCafe/data/`;
            var amount: number = 0;
            readdirSync(filePath, 'utf-8').forEach((file) => {
                console.log(`${filePath}${file}.txt`)
                readFileSync(`${filePath}${file}`, 'utf-8').split("\n").forEach((r) => {
                    amount += file.split("Raffle")[0] === "bag" ? 2500 : 5000}
                )
            });
            return await message.reply(`Total amount yielded: ${amount}`)
        default:
            try{
                raffle = args[1].toLowerCase()
                filePath = `/home/jamie/projects/leCafe/data/${raffle}Raffle.txt`;
            
            } catch(e){
                return message.reply("Please include a valid name and amount, Usage: $raffle [DUMP] [RAFFLENAME]");
            }
            return message.reply("Usage: $raffle [ADD/VIEW/DUMP]")
    }

};