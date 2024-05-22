import puppeteer from "puppeteer";
import dotenv from "dotenv";
import * as fs from "fs";

dotenv.config();
const username = process.env.UPE_USERNAME;
const password = process.env.UPE_PASSWORD;

async function scrape() {
    const browser = await puppeteer.launch({headless: "new"});
    const page = await browser.newPage();
    await page.goto("https://upe.seas.ucla.edu/auth/login");
    await page.type('#id_username', username);
    await page.type('#id_password', password);
    await page.click('.button_div>.btn'); // click Login button
    await page.goto("https://upe.seas.ucla.edu/candidates/");

    const names = await page.$$eval('tbody>tr>th', names => {
        return names.map(name => name.innerText);
    });

    const tests = await page.$$eval('tbody>tr>td:nth-child(13)', tests => {
        return tests.map(test => {
            if (test.classList.contains("completed"))
                return true
            else
                return false
        });
    });

    const resumes = await page.$$eval('tbody>tr>td:nth-child(5)', resumes => {
        return resumes.map(resume => {
            if (resume.classList.contains("completed"))
                return true
            else
                return false
        });
    });

    await page.goto("https://upe.seas.ucla.edu/auth/logout");
    await browser.close();

    let data = names.map((e, i) => [e, tests[i], resumes[i]])
    console.log(data)

    data.map(list => {
        let a, b;
        [a,b] = list[0].split("\n");
        list.splice(0,1,a.replace(/\s+/g,' ').trim(),b)
    });

    data = data.filter((value, index, self) =>
        index === self.findIndex((t) => (
            t[1] === value[1]
        ))
    )
    
    console.log(data)
    
    data.sort((list1, list2) => {
        var name1 = list1[0].split(" ")
        var name2 = list2[0].split(" ")
        var lastName1 = name1.pop()
        var lastName2 = name2.pop()
        var firstName1 = name1.join(" ")
        var firstName2 = name2.join(" ")
        if (lastName1 < lastName2)
            return -1;
        else if (lastName1 > lastName2)
            return 1;
        else if (firstName1 < firstName2)
            return -1;
        else if (firstName1 > firstName2)
            return 1;
        else if (list1[1] < list2[1])
            return -1;
        else if (list1[1] > list2[1])
            return 1;
        else
            return 0;
    });
    
    console.log(data)
    
    var csv_header = "Name\tEmail (from website)\tUpload Tests (3)\tUpload Resume\n";
    var csv_data = data.map(list => list.join('\t')).join('\n');
    var csv = csv_header + csv_data;

    console.log(csv)

    fs.writeFile('uploads.tsv', csv, 'utf-8', (err) =>{
        if (err) {
            console.log("Error writing to uploads.tsv")
        }
        else {
            console.log("Successfully wrote to uploads.tsv")
        }

    });
}

scrape();