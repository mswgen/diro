$(() => {
    $('form').submit(async x => {
        x.preventDefault();
        if (document.querySelector('#url').value == '') return false;
        var res = await axios.post('https://diro.ga/api/shorten', {
            url: encodeURIComponent(document.querySelector('#url').value),
            custom: document.querySelector('#custom').value || undefined
        });
        document.querySelector('#shortened').innerHTML = `<a href="https://diro.ga/${res.data.code}">https://diro.ga/${res.data.code}</a>`;
        document.querySelector('#url').value = '';
        document.querySelector('#custom').value = '';
        return false;
    });
});