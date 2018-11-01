const Page = require('./helpers/page');

const URL = 'http://localhost:3000';
let page;

beforeEach(async()=>{
    page = await Page.build();
    await page.goto(URL);
});

afterEach(async()=>{
    await page.close();
});

describe('When Logged in', async()=>{
    beforeEach(async()=>{

        await page.login();
        await page.goto('localhost:3000/blogs');
        await page.click('a.btn-floating');
    });


    test('should display create blog form', async()=>{
        const text = await page.getContentsOf('form label');
        expect(text).toEqual('Blog Title');
    });


    describe('Using valid inputs', async()=>{
        beforeEach(async()=>{
            await page.type('.title input', 'My title');
            await page.type('.content input', 'My content');
            await page.click('form button');
            
        })

        test('should take user to review screen after submitting', async()=>{
            const text = await page.getContentsOf('h5');
            expect(text).toEqual('Please confirm your entries');
        });

        test('should add blog to the index page', async()=>{
            await page.click('button.green');
            await page.waitFor('.card');
            const title = await page.getContentsOf('.card-title');
            const content = await page.getContentsOf('p');
            expect(title).toEqual('My title');
            expect(content).toEqual('My content');
        });

    });


    describe('And using invalid inputs', async()=>{
        beforeEach(async ()=>{
            await page.click('form button');
        });

        test('should display an error message', async()=>{
            const titleErr = await page.getContentsOf('.title .red-text');
            const contentErr = await page.getContentsOf('.content .red-text');
            expect(titleErr).toEqual('You must provide a value');
            expect(contentErr).toEqual('You must provide a value');

        });

    });
});


describe('user is not logged in', async()=>{
    test('user cannot make blog post', async()=>{
        const result = await page.evaluate(()=>{
            return fetch('/api/blogs', {
                method: 'POST',
                credentials: 'same-origin',
                headers:{
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({title: 'my title', content:'my content'})
            }).then(res=>res.json());
        });

        expect(result).toEqual({error: 'You must log in!'});
    });

    test('user cannot get', async()=>{
        const result = await page.evaluate(()=>{
            return fetch('/api/blogs', {
                method: 'GET',
                credentials: 'same-origin',
                headers:{
                    'Content-Type': 'application/json'
                },
            })
        });

        expect(result).toEqual({});
    });
});