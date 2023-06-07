const { readFileSync, writeFileSync, copyFileSync } = require("fs");

const files = [
    {
        name: "Home",
        source: "home.html",
        output: "index",
        menu: []
    },
    {
        name: "Products",
        source: 'products.html',
        output: "products",
        menu: ['index', 'products']
    },
    {
        name: "Services",
        source: null,
        output: "services",
        menu: ['index', 'services']
    },
    {
        name: "About Us",
        source: "about.html",
        output: "about-us",
        menu: ['index', 'about-us']
    },
    {
        name: "Contact Us",
        source: "contact.html",
        output: "contact-us",
        menu: ['index', 'contact-us']
    },
    {
        name: "Feedback",
        source: "feedback.html",
        output: "feedback",
        menu: ['index', 'feedback']
    },
    {
        name: "Women's Shoes",
        source: "products-women.html",
        output: "products-women",
        menu: ['index', 'products', 'products-women']
    },
    {
        name: "Men's Shoes",
        source: "products-men.html",
        output: "products-men",
        menu: ['index', 'products', 'products-men']
    }
];

const shoes = [
    {
        name: "Gary",
        colors: ["black", "tan"],
        price: 79,
        sizes: [6, 7, 8, 9, 10, 11],
        gender: true,
        copy: 'shoes/gary-copy.html',
        details: {
            "Product Code": "30213",
            "Sole Material": "Rubber",
            "Sock Material": "Synthetic",
            "Lining Material": "Eco friendly",
            "Upper Material": "Leather"
        },
        output: 'product-gary'
    },
    {
        name: "Work and Walk",
        colors: ["chestnut"],
        price: 85,
        sizes: [6, 7, 8, 9, 10, 11],
        gender: true,
        copy: 'shoes/work-and-walk-copy.html',
        details: {
            "Product Code": "30144",
            "Sole Material": "Rubber",
            "Sock Material": "Pigskin",
            "Lining Material": "Mesh",
            "Upper Material": "Leather"
        },
        output: 'product-work-and-walk'
    },
    {
        name: "Sally",
        colors: ["black", "tan"],
        price: 75,
        sizes: [6, 7, 8, 9, 10, 11],
        gender: false,
        copy: 'shoes/sally-copy.html',
        details: {
            "Product Code": "301818",
            "Sole Material": "Phylon rubber",
            "Sock Material": "Pigskin",
            "Lining Material": "Leather/synthetic",
            "Upper Material": "Leather"
        },
        output: 'product-sally'
    },
    {
        name: "Heavenly",
        colors: ["black"],
        price: 90,
        sizes: [6, 7, 8, 9, 10, 11],
        gender: false,
        copy: 'shoes/heavenly-copy.html',
        details: {
            "Product Code": "21960",
            "Sole Material": "Rubber",
            "Sock Material": "Pigskin",
            "Lining Material": "Unlined",
            "Upper Material": "Leather"
        },
        output: 'product-heavenly'
    },
    {
        name: "Clancy",
        colors: ["blue"],
        price: 59,
        sizes: [6, 7, 8, 9, 10, 11],
        gender: false,
        copy: 'shoes/clancy-copy.html',
        details: {
            "Product Code": "30182",
            "Sole Material": "Rubber",
            "Sock Material": "Pigskin",
            "Lining Material": "Unlined",
            "Upper Material": "Leather"
        },
        output: 'product-clancy'
    }
];

const navlinks = ['index', 'products', 'services', 'about-us', 'contact-us'];
const template = readFileSync("./template.html").toString();

function replaceWithIndent(content, find, replace) {
    const position = content.indexOf(find);

    let i = 1, indent = '', char = content.charAt(position - i);
    while (char == "\t" || char == " ") {
        indent += char;
        i++;
        char = content.charAt(position - i);
    }

    replace = replace.replaceAll("\n", "\n" + indent);
    return content.replace(find, replace);
}

files.filter(file => file.source).forEach(file => {
    const links = files
        .filter(page => navlinks.indexOf(page.output) >= 0)
        .reduce((content, page) => {
            if (page.output == file.output) {
                return content + `<li class="current">${page.name}</li>`
            }

            const url = page.source ? `${page.output}.html` : `#${page.output}`;
            return content + `<li>\n\t<a href="${url}">${page.name}</a>\n</li>\n`;
        }, "");

    let breadcrumb = '';
    if (file.menu.length > 0) {
        breadcrumb = '\n<nav class="breadcrumb">\n\t<ul>\n';
        breadcrumb += files
            .filter(page => file.menu.indexOf(page.output) >= 0)
            .reduce((content, page) => {
                if (page.output == file.output) {
                    return content + '\t\t<li>' + page.name + '</li>\n';
                } else {
                    return content + '\t\t<li>\n\t\t\t<a href="./' + page.output + '.html">' + page.name + '</a>\n\t\t</li>\n';
                }
            }, "");
        breadcrumb += '\t</ul>\n</nav>\n';
    }

    let content = replaceWithIndent(template, '%LINKS%', links);
    content = replaceWithIndent(content, '%BREADCRUMB%', breadcrumb);
    content = replaceWithIndent(content, '%CONTENT%', readFileSync(file.source).toString());
    content = content.replaceAll('%PAGENAME%', file.name);
    content = content.replaceAll('%SLUG%', file.output);

    writeFileSync(`../website/${file.output}.html`, content);
});

const shoeTemplate = readFileSync("./shoe-template.html").toString();

const shoeLinks = files
    .filter(page => navlinks.indexOf(page.output) >= 0)
    .reduce((content, page) => {
        const url = page.source ? `${page.output}.html` : `#${page.output}`;
        return content + `<li>\n\t<a href="${url}">${page.name}</a>\n</li>\n`;
    }, "");

shoes.forEach(shoe => {
    let baseTemplate = replaceWithIndent(template, '%LINKS%', shoeLinks);

    shoe.colors.forEach(color => {
        const slug = shoe.output + '-' + color;
        const fullName = `${shoe.name} (${color.charAt(0).toUpperCase()}${color.substring(1)})`;

        let shoeContent = shoeTemplate.replaceAll('%NAME%', fullName);
        shoeContent = shoeContent.replaceAll('%MAINIMG%', `./img/${slug}.jpg`);

        let colorList = '';
        if (shoe.colors.length > 1) {
            colorList = '<div class="product-colors">\n';
            for (let i = 0; i < shoe.colors.length; i++) {
                if (shoe.colors[i] == color) {
                    continue;
                }

                const colorSlug = shoe.output + '-' + shoe.colors[i],
                    colorName = `${shoe.name} (${shoe.colors[i].charAt(0).toUpperCase()}${shoe.colors[i].substring(1)})`;

                colorList += '\t<div class="alternate">\n';
                colorList += '\t\t<a href="./' + colorSlug + '.html">\n';
                colorList += '\t\t\t<img src="./img/' + colorSlug + '.jpg" width="133" height="100" alt="' + colorName + ' shoe">\n';
                colorList += '\t\t</a>\n';
                colorList += '\t</div>\n'
            }
            colorList += '</div>';
        }

        shoeContent = replaceWithIndent(shoeContent, '%COLORS%', colorList);

        const sizeOptions = shoe.sizes.map(size => `<option value="${size}">US ${size}</option>`).join("\n\t");
        const sizes = `<select id="shoe-size">\n\t${sizeOptions}\n</select>`;
        shoeContent = replaceWithIndent(shoeContent, '%SIZES%', sizes);

        const copy = readFileSync(shoe.copy).toString();
        shoeContent = replaceWithIndent(shoeContent, '%COPY%', copy);

        shoeContent = replaceWithIndent(shoeContent, '%PRICE%', shoe.price.toFixed(2));

        let detailsTable = '<table>\n';
        Object.keys(shoe.details).filter(shoe.details.hasOwnProperty.bind(shoe.details)).forEach(detail => {
            detailsTable += `\t<tr>\n\t\t<td>${detail}</td>\n\t\t<td>${shoe.details[detail]}</td>\n\t</tr>\n`;
        });
        detailsTable += '</table>';

        shoeContent = replaceWithIndent(shoeContent, '%DETAILS%', detailsTable);

        let gender = shoe.gender ? 'men' : 'women';
        let genderName = shoe.gender ? 'Men' : 'Women';

        let breadcrumb = '\n<nav class="breadcrumb">\n\t<ul>\n';
        breadcrumb += '\t\t<li>\n\t\t\t<a href="./index.html">Home</a>\n\t\t</li>\n';
        breadcrumb += '\t\t<li>\n\t\t\t<a href="./products.html">Products</a>\n\t\t</li>\n';
        breadcrumb += '\t\t<li>\n\t\t\t<a href="./products-' + gender + '.html">' + genderName + '\'s Shoes</a>\n\t\t</li>\n';
        breadcrumb += '\t\t<li>' + fullName + '</li>\n';
        breadcrumb += '\t</ul>\n</nav>\n';

        let content = replaceWithIndent(baseTemplate, '%BREADCRUMB%', breadcrumb);
        content = replaceWithIndent(content, '%CONTENT%', shoeContent);
        content = content.replaceAll('%PAGENAME%', fullName);
        content = content.replaceAll('%SLUG%', 'product');

        writeFileSync(`../website/${slug}.html`, content);
    });
});

copyFileSync('./css/style.css', '../website/css/style.css');