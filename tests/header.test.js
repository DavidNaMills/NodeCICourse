const Page = require('./helpers/page');

const URL ='http://localhost:3000';

let page;

beforeEach(async()=>{
    page = await Page.build();
    await page.goto(URL);
});

afterEach(async()=>{
    await page.close();
})

describe('puppeteer tests', ()=>{


    test('canary test', ()=>{
        expect(true).toBe(true);
    });
    
    
    test('should display the correct text in the banner', async(done)=>{
        const text = await page.getContentsOf('a.brand-logo');
        expect(text).toEqual('Blogster');
        done();
    });

    test('should start oauth flow after clicking login', async(done)=>{
        await page.click('.right a');
        const url = await page.url();
        expect(url).toMatch(/accounts\.google\.com/);
        done();
    });

    test('should show logout button when signed in', async(done)=>{
        await page.login();
        const text = await page.getContentsOf('a[href="/auth/logout"]');

        expect(text).toEqual('Logout');
        done();
    });
});