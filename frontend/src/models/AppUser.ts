import RadioStation from "./RadioStation.ts";

type AppUser = {
    id: string,
    username: string,
    favoriteRadioStations: RadioStation[]
}

export default AppUser