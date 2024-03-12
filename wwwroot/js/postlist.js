
const row = new Row(
    document.getElementById('main') //, "@model" root
);
await row.get('~/post/manifest');
row.generate_card();

await row.update()

// new Worker();

l = (s) => s
console.log(/*html*/`
<div>${l(`
    <div class="asd sado">
        aspdkp
    </div>`)}
</div>
`)