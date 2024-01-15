import {useState} from "react";
import "../stylesheets/ListHeader.css"

type ListHeaderProps = {
    setSearchInput: React.Dispatch<React.SetStateAction<string>>,
    searchInput: string,
    fetchData: (actualSearchInput:string) => void
}

export default function ListHeader(props:ListHeaderProps) {
    const [searchOpen, setSearchOpen] = useState(false)


    const toggleSeachInput = () => {
        setSearchOpen((searchOpen) => !searchOpen)
    }

    const handleSearchInput = (event:React.ChangeEvent<HTMLInputElement>) => {
        props.setSearchInput(event.target.value)
    }

    const handleXButton = () => {
        props.setSearchInput("")
        toggleSeachInput()
        props.fetchData("")
    }

    const handleKeyDown = (event:React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            props.fetchData(props.searchInput);
        }
    }


    return(
        <div id="listHeaderDiv">
            <div id="filterDiv">Sort / Filter</div>
            {
                searchOpen ?

                    <div className="searchInputOuterDiv">
                    <input
                            type="text"
                            onChange={handleSearchInput}
                            value={props.searchInput}
                            placeholder="search station"
                            onKeyDown={handleKeyDown}

                        />
                        <p className="searchInputDelX" onClick={handleXButton}><span>x</span></p>
                    </div> :
                    <img
                        className="lupe" src="../../public/search_FILL0_wght400_GRAD0_opsz24.svg" alt="Search Icon"
                        onClick={toggleSeachInput}
                    />
            }

        </div>
    )
}