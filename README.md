# Web-Page-Theme-Editor

Simple [script](https://github.com/tiagosimoes/Web-Page-Theme-Editor/raw/main/web-page-theme-editor.user.js) that extracts the theme of any web page. 

Usage:
- With any web page open, open chrome devtools (F12) and paste [this script](https://github.com/tiagosimoes/Web-Page-Theme-Editor/raw/main/web-page-theme-editor.user.js), 
  or
- Install it using the [Tampermonkey](https://www.tampermonkey.net/) chrome extension

Features:
- Check how many colors, font-sizes, etc... are being used
- See how many elements are using them, and where they are
- Modify the values (e.g. merge font-sizes to have less distinct values, simplifying the theme)

This is just an experience, and it should have lots of other bugs, but if you have feedback please let me know.

<kbd>![image](https://user-images.githubusercontent.com/7019226/161523941-2df87bcb-a306-4a4e-bdc4-97a7a8683eb2.png)</kbd>

Known issues:
- When using with Tampermonkey, it will not work correctly with SPA pages (e.g. done with React)
- Changing a color input does not update the color picker (the other way around works fine)
- Coloring the text of links still might not work (because of :active/:visited)
- Pressing up/down in properties with several values (e.g. in margins, padding, etc..) only changes the first value, instead of the one under the cursor

Future Improvements
- Merge two inputs when changing a value to be the same as another one 
- Have a way to increase/decrease all font-sizes, all margins, all paddings at the same time
- Have a way to change the luminosity, saturation and hue of all colors at the same time
- A new Groups section showing sets properties that are always applied to the exact same widgets
