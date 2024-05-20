const cheerio = require('cheerio');

exports.extractComponentsData = (html) => {
    const $ = cheerio.load(html);
    const components = [];

    //console.log("Loaded HTML for processing:", html);  // Log the full HTML loaded into Cheerio

    $('[customid]').each(function () {
        const type = $(this).attr('customid').split('_')[0];
        const attributes = [];
        const componentId = $(this).attr('id');

        // Collect all relevant attributes based on the type
        if (this.tagName.toLowerCase() === 'img') {
            attributes.push({ key: 'src', value: $(this).attr('src') });
            attributes.push({ key: 'alt', value: $(this).attr('alt') || '' });
        } else {
            // Assume all other elements use content as a "text" attribute
            attributes.push({ key: 'text', value: $(this).html() });
        }

        $(this).get(0).attribs && Object.keys($(this).get(0).attribs).forEach(attr => {
            if (['id', 'customid', 'src', 'alt', 'text'].indexOf(attr) === -1) { // Exclude already processed or irrelevant attributes
                attributes.push({ key: attr, value: $(this).attr(attr) });
            }
        });

        components.push({
            component_id: componentId,
            type: type,
            attributes: attributes
        });
    });

    console.log("Extracted components data:", components); // Log all extracted components data

    return components;
};
