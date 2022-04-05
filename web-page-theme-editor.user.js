// ==UserScript==
// @name         Web page theme editor
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Style the world
// @author       Tiago Simões
// @match        https://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    const defaultValues = ["auto", "start", "0px", "none", "normal", "rgba(0, 0, 0, 0)"];
    const propertyNames = ["background-color", "color", "font-size", "width", "height", "margin", "padding", "border", "border-radius", "box-shadow"];

    function getStyles(elem) {
        return propertyNames.map((propertyName) => {
            var val = elem.computedStyleMap().get(propertyName);
            if (val && !defaultValues.includes(val.toString()) && !val.toString().startsWith("0px none")) {
                return [propertyName , val.toString()];
            }
        }).filter((v) => v);
    }

    let styleCombinations = {};
    for (var elem of document.body.getElementsByTagName("*")) {
        if (elem.offsetParent != null){ /*object is visible*/
            for (var style of getStyles(elem)) {
                if (styleCombinations[style[0]] == null) styleCombinations[style[0]] = {};
                if (styleCombinations[style[0]][style[1]] == null) styleCombinations[style[0]][style[1]] = [];
                styleCombinations[style[0]][style[1]].push(elem);
            }
        }
    }
    let styleSheet = document.createElement("style");
    styleSheet.innerText = "dialog { all:initial; } dialog * { all:revert;} :focus-visible {outline: none;} details{max-height: 18px;} details[open] {max-height:1000px;}";
    document.head.appendChild(styleSheet);

    let dialog = document.createElement("dialog");
    dialog.style = "left: unset;margin: 10px; min-width:185px; border: 0; box-shadow: 1px 1px 3px #444; color: #333300;font-size: 14px;z-index: 2147483647; position: fixed; background: yellow;padding: 10px; right: 0;font-family:sans-serif;";
    let dialogContent = document.createElement("div");
    dialogContent.style = "overflow:auto;max-height:100vh;";
    dialog.appendChild(dialogContent);

    propertyNames.forEach(propertyName => {
        if (styleCombinations[propertyName] != null) {
            let details = document.createElement("details");
            details.style = "font-family:monospace; white-space: pre; transition: max-height .5s;overflow: hidden;";
            let differentValues = Object.entries(styleCombinations[propertyName]).sort((a,b) => b[1].length - a[1].length);
            let summary = document.createElement("summary");
            summary.style = "cursor:pointer; display:list-item' autofocus=false";
            summary.innerText = differentValues.length.toString().padStart(2, " ") + " " +
                (differentValues.length>1 ? (propertyName == "border-radius"? "border-radii": propertyName + "s"): propertyName);
            details.appendChild(summary);
            dialogContent.appendChild(details);

            differentValues.forEach(differentValue => {
                var formField = document.createElement("div");
                formField.innerHTML = differentValue[1].length.toString().padStart(4, " ");
                var input = document.createElement("input");
                var propertyValue = differentValue[0];
                input.style = "font-size: 12px;padding: 2px;width: 110px;margin: 1px 5px;border-radius: 2px; border: 1px solid #999;";
                input.value = propertyValue;
                formField.title = differentValue[1].length + " " + propertyValue;
                let highlight = () => {
                    styleCombinations[propertyName][propertyValue][0].scrollIntoViewIfNeeded({behavior: "smooth"});
                    setTimeout(() => styleCombinations[propertyName][propertyValue].forEach(e => {e.style.transition = "outline 0.2s"; e.style.outline = "10px solid blue"}), 200);
                    setTimeout(() => styleCombinations[propertyName][propertyValue].forEach(e => {e.style.outline = "3px solid blue"}), 400);
                    input.parentElement.style = "color:blue; font-weight:bold";
                };
                let removeHighlight = () => {
                    styleCombinations[propertyName][propertyValue].forEach(e => {e.style.outline =""});
                    setTimeout(() => styleCombinations[propertyName][propertyValue].forEach(e => { e.style.outline = ""}),400);
                    input.parentElement.style = "";
                };
                let updateValue = () => {
                    styleCombinations[propertyName][propertyValue].forEach(e => {e.style[propertyName] = input.value });
                    removeHighlight();
                };
                if (propertyName.endsWith("color")) {
                    let colorpicker = document.createElement("input");
                    colorpicker.type = "color";
                    colorpicker.style = "padding: 0;box-shadow: none;background: unset;border: 0;margin: 0px -3px 0px 5px;width: 25px;height:28px;display: inline-block;vertical-align: middle;cursor:pointer;";
                    let rgbToHex = (rgbValue) => "#" + rgbValue.substring(4, rgbValue.length-1).replace(/ /g, "").split(",")
                        .map(x => parseInt(x).toString(16).padStart(2, "0")).join(""); 
                    colorpicker.value = rgbToHex(propertyValue);
                    colorpicker.oninput = () => {
                        input.value = colorpicker.value;
                        updateValue();
                    };
                    formField.appendChild(colorpicker);
                }
                formField.onmouseover = highlight;
                input.onfocus = highlight;
                input.oninput = updateValue;
                formField.addEventListener("mouseout", removeHighlight);
                input.addEventListener("focusout", removeHighlight);
                input.onkeydown = (evt) => {
                    let value = parseFloat(input.value);
                    if (!isNaN(value)) {
                        if (evt.which == 38 || evt.which == 104) {
                            input.value = input.value.replace(value, Math.round(value + 1));
                        } else if (evt.which == 40 || evt.which == 98) {
                            input.value = input.value.replace(value, Math.round(value - 1));
                        }
                        updateValue();
                    }
                };
                formField.appendChild(input);
                details.appendChild(formField);
            });
        }
    });
    document.body.prepend(dialog);
    dialog.show();
})();
