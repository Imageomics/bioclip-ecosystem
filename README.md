# BioCLIP Ecosystem

Centralized resource to describe and link out to all components of the BioCLIP project (Code, Models, Datasets, Spaces).

## Project Structure

The site runs based on the following files

* `index.html`: The main HTML file that provides the structure of the webpage and links to pages based on resource type.
* `css/style.css`: Custom styling for the application, including color schemes, layout, and animations.
    * `css/variables.css`: Pre-defined variables (e.g., Imageomics colors) for use in the custom styling for the site.
* `pages/`: Folder containing the subpages of the site.
  * `data.html`: Page to describe and link to all datasets and benchmarks used for trainging and evaulating the BioCLIP models, e.g., TreeOfLife-200M and Rare Species.
  * `demos.html`: Page to describe and link to BioCLIP and BioCAP demos as available.
  * `models.html`: Page to describe and link to all BioCLIP models.
  * `software.html`: Page to describe and link to all software used in creating the models and datasets, as well as those to explore and more easily utilize them (e.g., `TaxonoPy` and `pybioclip` ).

## Local Testing

In the repo root, run

```console
python -m http.server 8080
```

Then open <http://[::]:8080/> in your browser of choice.
