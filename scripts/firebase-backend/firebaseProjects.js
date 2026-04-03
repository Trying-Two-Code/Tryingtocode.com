import { collection, limit, query,
    getDoc, getDocs, setDoc, doc, 
    serverTimestamp } 
from "https://www.gstatic.com/firebasejs/12.8.0/firebase-firestore.js"

const database_name = "projects";

export let setProject = async ({ owner = window.user, 
                                 title="default", 
                                 data="print('hello world')", 
                                 section="default", 
                                 language="py", 
                                 includeDisclude={}, 
                                 mission="",
                                 priority=0 } = {}) => 
{
    if(typeof owner === "undefined") { console.error("tried proj w/out owner"); return null; }

    const characterLimit = 10000;
    const characterAmm = (title.length + data.length + section.length + language.length);
    if(characterAmm > characterLimit) {console.error("character limit exceeded: ", characterAmm); return;}

    console.log(section);
    const projectRef = doc(window.db, database_name, owner, section, title);
    let obj = {
        title: title,
        mission: mission,
        data: data,
        lastUpdated: serverTimestamp(),
        language: language,
        includeDisclude: includeDisclude,
        priority: priority
    };

    try {
        await setDoc(projectRef, obj, {merge: true});
    }
    catch (error){
        console.error("oops. That project did not set well.", error);
        console.log(user, [user.uid, owner], section, title);
        return error;
    }
}


export let findProjects = async ({ section = "default", owner = window.user.uid } = {}) => {
    console.log("finding projects");
    let projectLimit = 100;

    let projects = [];

    try{
        const projectQuery = query(
            collection(window.db, database_name, owner, section), 
            limit(projectLimit)
        );
        const documentsSnapshot = await getDocs(projectQuery);

        documentsSnapshot.forEach(element => {
            console.log(element.data());
            projects.push(element.data());
        });

        console.log(documentsSnapshot);
    } catch (error) {
        console.error(error);
        return null;
    }
    
    return projects;
}

export let findProject = async ({ section = "default", title = "default-1" } = {}) => {
    let owner = window.user.uid;

    const docRef = doc(window.db, database_name, owner, section, title);
    let document = await getDoc(docRef);

    console.log(docRef.path);
    console.log(document);
    console.log(document.data());
}

window.addEventListener("user_set", () => {
    //setProject  ({ section: "default", title: "defualt-2", data: "#nothing to see here" });
    //findProject ({ section: "default", title: "default-1" });
    //findProjects({ section: "default" });
});