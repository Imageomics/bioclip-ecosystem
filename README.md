# BioCLIP Ecosystem

Centralized resource to describe and link out to all components of the BioCLIP project (Code, Models, Datasets, Spaces).

## Project Structure

The site runs based on the following files. All site images are called from the `images/` directory.

* `index.html`: The landing page for the BioCLIP Ecosystem website; this page prominently features the BioCLIP classification gif, and includes a decision guide with cards for each of the pages to help visitors narrow their search. It also links out to the full BioCLIP model, data, and demo collection on Hugging Face.
* `css/style.css`: Custom styling for the application, including color schemes, layout, and animations.
    * `css/variables.css`: Pre-defined variables (e.g., Imageomics colors) for use in the custom styling for the site.
* `js/load-components.js`: JavaScript file to load header and footer from the `components/` directory. Web and mobile navigation are controlled through this file; all pages must be listed here.
* `pages/`: Folder containing the subpages of the site.
  * `data.html`: Describes and links to all datasets and benchmarks used for training and evaulating the BioCLIP models, e.g., TreeOfLife-200M and Rare Species.
  * `demos.html`: Describes and links to BioCLIP ecosystem demos with use instructions.
  * `models.html`: Describes and links to all BioCLIP models, e.g., BioCLIP 2.5 Huge and BioCAP.
  * `papers.html`: Includes abstracts and links to papers and project-specific sites for each BioCLIP publication.
  * `software.html`: Describes and links to all software used in creating the models and datasets, as well as those to explore and more easily utilize them (e.g., `TaxonoPy` and `pybioclip` ).

## Local Testing

In the repo root, run

```console
python -m http.server 8080
```

Then open <http://[::]:8080/> in your browser of choice.
