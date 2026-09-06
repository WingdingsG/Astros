# Welcome to Astros!
> [!NOTE]
> This project is just a test made. There will be no updates to it for improvements or fixes related to it, resulting in it being a final product and open-source. 

This project has been create for the purpose of understanding _complex web application_, __Single Page Application (SPA)__. The project, which combines astronomical simulation elements with interactive mechanics, is built on a robust architecture, using exclusively native web technologies.

> ### Contents
> - [Interface](#interface)
> - [Control](#control)
> - [Exploration](#exploration)
> - [Hardware Limitation](#hardware-limitation)
> - [Sources](#sources)

## Interface
The main menu (Overlay) serves as a launchpad, providing the user with clear navigation instructions before the graphics engine is initialized. Once the _INITIALIZE LAUNCH_ button is activated, the procedural generation scripts and audio system are triggered.

> [!NOTE]
> The _SYSTEMS_ status is always online to represent it's ready since it's a local file.
<img width="601" height="325" alt="image" src="https://github.com/user-attachments/assets/bbc611ce-e2c1-4bae-aa88-eb07987170f3" />

## Control
To be able to interact with the game you need to know the following actions:
- Movement (Up, Left, Down, Right): `W`,`A`,`S`,`D` or `↑`,`←`,`↓`,`→`
- Thrusters boost (Acceleration): `Shift`
- Zoom: `Scroll Wheel`
- Interact: `Left Mouse Click`
- Media (in the _right-bottom corner_)
<img width="140" height="61" alt="image" src="https://github.com/user-attachments/assets/58c3c470-1114-4903-b308-daac1476cb0e" />

  - Previous: `first button`
  - Pause/Redo: `second button`
  - Next: `third button`


> [!TIP]
> In order to interact with any celestial body you need to be close to it. The further you are, the weaker the _signal_ receiving will be. Clicking on nothing will close the _signal_.

## Exploration
You can travel around the planets to understand about them with information such as:
- Its distance to the Sun;
- The gravity pull it has;
- How many moons are orbiting;
- Basic fact about them.

> [!NOTE]
> You can run forever in space and there are no collisions. Elements that are not visible by the camera will not be rendered.
> If the camera is very far away (zoomed out too much), elements will be simplified.

> [!WARNING]
> Trying to go as further as possible from the Solar System will make the space have less or no details and you could be totally lost.
> Refresh the page in case you want to come back.
<img width="1004" height="565" alt="image" src="https://github.com/user-attachments/assets/8e44aa81-e9c6-464c-9331-36dd875b5779" />

# Hardware limitation
> [!WARNING]
>  When tested on Windows 11, Brave browser, the following results in resource consumption were noticed:
> - **CPU**: ~1.5GHz
> - **RAM**: ~180MB
> - **Storage**: 43MB

## Sources
**[NASA Solar System Exploration](https://science.nasa.gov/solar-system/)** - Source for statistical data and planet descriptions.\
**[MDN Web Docs](https://developer.mozilla.org/en-US/)** - Technical documentation for HTML5 Canvas API and JavaScript.\
**[Wikipedia Commons](https://commons.wikimedia.org/wiki/Main_Page)** - Source for texture maps used for visual rendering of celestial bodies.\

**[Galaxies](https://open.spotify.com/album/7cPOCcwKBpTq5SwNM1oNAn)** – First soundtrack, by Lee Ryda.\
**[Andromeda Galaxy](https://www.youtube.com/watch?v=Qhm_sGftkhQ)** – Second soundtrack, by Michel Redolfi.\
**[Marine Snow](https://www.youtube.com/watch?v=j9Y-tB8Memw)** – Third soundtrack, by Creo.\
**[Pelagic](https://www.youtube.com/watch?v=COhOOxrGMic)** – Fourth soundtrack, by kvbii.\
**[Submersion lullaby](https://www.youtube.com/watch?v=xuwxFnav2SA)** – Fifth soundtrack, by kvbii.

> [!CAUTION]
> These soundtracks have been used without the consent of their authors! I will take them down if they request to do so.
