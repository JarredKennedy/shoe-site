const { readFileSync, writeFileSync, copyFileSync } = require("fs");

const files = [
    {
        name: "Home",
        source: "home.html",
        output: "index"
    },
    {
        name: "Products",
        source: 'products.html',
        output: "products"
    },
    {
        name: "Services",
        source: null,
        output: "services"
    },
    {
        name: "Contact Us",
        source: "contact.html",
        output: "contact-us"
    },
    {
        name: "Feedback",
        source: "feedback.html",
        output: "feedback"
    },
    {
        name: "Women's Shoes",
        source: "products-women.html",
        output: "products-women"
    },
    {
        name: "Men's Shoes",
        source: "products-men.html",
        output: "products-men"
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

const navlinks = ['index', 'products', 'services', 'contact-us'];
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

    let content = replaceWithIndent(template, '%LINKS%', links);
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
        shoeContent = shoeContent.replaceAll('%COLORS%', '');

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

        let content = replaceWithIndent(baseTemplate, '%CONTENT%', shoeContent);
        content = content.replaceAll('%PAGENAME%', fullName);
        content = content.replaceAll('%SLUG%', 'product');

        writeFileSync(`../website/${slug}.html`, content);
    });
});

copyFileSync('./css/style.css', '../website/css/style.css');