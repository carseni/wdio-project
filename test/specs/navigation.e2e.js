// const { expect } = require('@wdio/globals');

// describe('Navigation checks', () => {
//   it('should open the homepage and verify title', async () => {
//     await browser.url('https://the-internet.herokuapp.com/');
//     const title = await browser.getTitle();
//     console.log('Page title is:', title);
//     await expect(title).toContain('The Internet');
//   });

//   it('should navigate to the A/B Testing page and verify header', async () => {
//     await browser.url('https://the-internet.herokuapp.com/abtest');
//     const header = await $('h3');
//     await expect(header).toBeExisting();
//     //await expect(await header.getText()).toContain('A/B Test');
//     await expect(header).toHaveTextContaining('A/B Test');

//   });
// });


const { expect } = require('@wdio/globals');

describe('Navigation checks', () => {
  it('should open the homepage and verify title', async () => {
    await browser.url('https://the-internet.herokuapp.com/');
    const title = await browser.getTitle();
    console.log('Page title is:', title);
    await expect(title).toContain('The Internet');
  });

  it('should navigate to the A/B Testing page and verify header', async () => {
    await browser.url('https://the-internet.herokuapp.com/abtest');
    const header = await $('h3');
    await expect(header).toBeExisting();
    await expect(header).toHaveText(
      expect.stringContaining('A/B Test')
    );
  });
});
