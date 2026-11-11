# Contornos oficiais das áreas de delegacia (CISP) do Rio de Janeiro, do pacote
# ispdata (CRAN), simplificados (~25 m) e gravados em GeoJSON WGS84.
# Uso: Rscript scripts/cisp_rj.R saida.geojson
args <- commandArgs(trailingOnly = TRUE)
saida <- if (length(args)) args[1] else "cisp_rj.geojson"
suppressPackageStartupMessages({ library(sf); library(ispdata) })
data("spatial_cisp", package = "ispdata")
x <- sf::st_make_valid(spatial_cisp)
print(names(x))
x <- sf::st_transform(x, 31983)
x <- sf::st_simplify(x, dTolerance = 25, preserveTopology = TRUE)
x <- sf::st_transform(x, 4326)
if (file.exists(saida)) file.remove(saida)
sf::st_write(x, saida, driver = "GeoJSON", quiet = TRUE)
cat(nrow(x), "CISPs gravadas em", saida, "\n")
