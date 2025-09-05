//for use as a rect for editable projects

//general use

console.log("project");

htmlGen = 
`
<body>
    <template>
        <p>general text</p>
    </template>
</body>
`

function display(htmlString=htmlGen, document=document){
    document.createElement(htmlString)
}

display()

//learn
