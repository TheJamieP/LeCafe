import { EmbedBuilder} from "discord.js";
import { db } from "..";

type DailyBrainrot = {
    ID: number,
    Expiry: number,
    Character: string
}

const GenCharacter = (AuthorID: number, message: any) => {
    // not cached for today.
    const Expiry = (Date.now() + 24 * 60 * 60 * 1000)
    const Character = GetRandomBrainrot();
    db.query("DELETE FROM DailyBrainrotCache WHERE ID = $ID").all({$ID: AuthorID});
    db.query("INSERT INTO DailyBrainrotCache VALUES ($ID, $Expiry, $Character)").values({
        $ID: AuthorID,
        $Expiry: (Date.now() + 24 * 60 * 60 * 1000),
        $Character: Character
    })
    return displayBrainrot(AuthorID, Expiry, Character, message)
}

const GetRandomBrainrot = () => {
    const BrainrotCharacters = [
        "Tralalero Tralala",
        "Bombardino Crocodilo",
        "Chimpanzini Bananini",
        "Tung Tung Tung Sahur",
        "Ballerina Cappuccina",
        "Cappuccino Assassino",
        "Tripi Tropi",
        "Brr Brr Patapim",
        "Lirili Larila",
        "Bombombini Gusini",
        "Boneca Ambalabu",
    ];
    return BrainrotCharacters[Math.floor(Math.random() * BrainrotCharacters.length - 1)]
}

const displayBrainrot = async (AuthorID: number, Expiry: number, Character: string, message:any) => {
    await fetch(`http://localhost:3022/image/?q=${Character}`, {method: "GET"}).then((v) => v.json()).then(async (v: any) => {
        const Embed = new EmbedBuilder()
            .setColor(0xFFFFFF)
            .setTitle("Daily Brainrot")
            .addFields(
                {name: "Your daily brainrot Character is: ", value: Character},
            )
            .setImage(v.link)
            .setFooter({text: "Expires: " + new Date(Expiry) .toUTCString() });
        
        await message.channel.send({embeds: [Embed]})



    }) 
}

export default async (message: any, args: string[]): Promise<void> => {
    const AuthorID: number = message.author.id;
    const Query = db
        .query("SELECT * FROM DailyBrainrotCache where ID = $ID")
        .get({ $ID: AuthorID }) as (DailyBrainrot);
    console.log(Query)      
    if (Query === null || Query.Expiry - Date.now() <= 0) return GenCharacter(AuthorID, message)
    return displayBrainrot(Query.ID, Query.Expiry, Query.Character, message)
};


