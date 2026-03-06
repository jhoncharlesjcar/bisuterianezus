// Cascading location data for Peru: Region → Provincia → Distrito
// Covers the main regions and their most important provinces/districts

export interface PeruLocation {
    regions: Record<string, {
        label: string
        provincias: Record<string, {
            label: string
            distritos: string[]
        }>
    }>
}

export const peruLocations: PeruLocation = {
    regions: {
        lima: {
            label: "Lima",
            provincias: {
                lima_metro: {
                    label: "Lima Metropolitana",
                    distritos: [
                        "Ate", "Barranco", "Breña", "Carabayllo", "Chaclacayo", "Chorrillos",
                        "Cieneguilla", "Comas", "El Agustino", "Independencia", "Jesús María",
                        "La Molina", "La Victoria", "Lima (Cercado)", "Lince", "Los Olivos",
                        "Lurigancho-Chosica", "Lurín", "Magdalena del Mar", "Miraflores",
                        "Pachacámac", "Pucusana", "Pueblo Libre", "Puente Piedra",
                        "Punta Hermosa", "Punta Negra", "Rímac", "San Bartolo",
                        "San Borja", "San Isidro", "San Juan de Lurigancho",
                        "San Juan de Miraflores", "San Luis", "San Martín de Porres",
                        "San Miguel", "Santa Anita", "Santa María del Mar", "Santa Rosa",
                        "Santiago de Surco", "Surquillo", "Villa El Salvador",
                        "Villa María del Triunfo"
                    ]
                },
                callao: {
                    label: "Callao",
                    distritos: [
                        "Callao", "Bellavista", "Carmen de la Legua Reynoso",
                        "La Perla", "La Punta", "Mi Perú", "Ventanilla"
                    ]
                },
                canete: {
                    label: "Cañete",
                    distritos: ["San Vicente de Cañete", "Asia", "Cerro Azul", "Imperial", "Lunahuaná", "Mala", "Nuevo Imperial"]
                },
                huaura: {
                    label: "Huaura",
                    distritos: ["Huacho", "Hualmay", "Huaura", "Santa María", "Sayán", "Vegueta"]
                },
            }
        },
        arequipa: {
            label: "Arequipa",
            provincias: {
                arequipa_prov: {
                    label: "Arequipa",
                    distritos: [
                        "Arequipa (Cercado)", "Alto Selva Alegre", "Cayma", "Cerro Colorado",
                        "Characato", "Chiguata", "Jacobo Hunter", "José Luis Bustamante y Rivero",
                        "Mariano Melgar", "Miraflores", "Mollebaya", "Paucarpata",
                        "Sachaca", "Socabaya", "Tiabaya", "Uchumayo", "Yanahuara", "Yura"
                    ]
                },
                camana: {
                    label: "Camaná",
                    distritos: ["Camaná", "José María Quimper", "Mariscal Cáceres", "Nicolás de Piérola", "Ocoña", "Quilca", "Samuel Pastor"]
                },
                islay: {
                    label: "Islay",
                    distritos: ["Mollendo", "Cocachacra", "Dean Valdivia", "Islay", "Mejía", "Punta de Bombón"]
                }
            }
        },
        cusco: {
            label: "Cusco",
            provincias: {
                cusco_prov: {
                    label: "Cusco",
                    distritos: [
                        "Cusco (Cercado)", "Ccorca", "Poroy", "San Jerónimo",
                        "San Sebastián", "Santiago", "Saylla", "Wánchaq"
                    ]
                },
                urubamba: {
                    label: "Urubamba",
                    distritos: ["Urubamba", "Chinchero", "Huayllabamba", "Machupicchu", "Maras", "Ollantaytambo", "Yucay"]
                },
                la_convencion: {
                    label: "La Convención",
                    distritos: ["Quillabamba", "Echarati", "Huayopata", "Maranura", "Santa Ana", "Santa Teresa"]
                }
            }
        },
        piura: {
            label: "Piura",
            provincias: {
                piura_prov: {
                    label: "Piura",
                    distritos: [
                        "Piura (Cercado)", "Castilla", "Catacaos", "Cura Mori",
                        "El Tallán", "La Arena", "La Unión", "Las Lomas", "Tambo Grande", "Veintiséis de Octubre"
                    ]
                },
                sullana: {
                    label: "Sullana",
                    distritos: ["Sullana", "Bellavista", "Ignacio Escudero", "Lancones", "Marcavelica", "Miguel Checa", "Querecotillo", "Salitral"]
                },
                talara: {
                    label: "Talara",
                    distritos: ["Pariñas", "El Alto", "La Brea", "Lobitos", "Los Órganos", "Máncora"]
                }
            }
        },
        la_libertad: {
            label: "La Libertad",
            provincias: {
                trujillo: {
                    label: "Trujillo",
                    distritos: [
                        "Trujillo (Cercado)", "El Porvenir", "Florencia de Mora", "Huanchaco",
                        "La Esperanza", "Laredo", "Moche", "Poroto", "Salaverry",
                        "Simbal", "Víctor Larco Herrera"
                    ]
                },
                ascope: {
                    label: "Ascope",
                    distritos: ["Ascope", "Chicama", "Chocope", "Magdalena de Cao", "Paiján", "Rázuri", "Santiago de Cao", "Casa Grande"]
                }
            }
        },
        lambayeque: {
            label: "Lambayeque",
            provincias: {
                chiclayo: {
                    label: "Chiclayo",
                    distritos: [
                        "Chiclayo (Cercado)", "Chongoyape", "Eten", "José Leonardo Ortiz",
                        "La Victoria", "Monsefú", "Pimentel", "Pomalca", "Reque",
                        "Santa Rosa", "Tumán"
                    ]
                },
                lambayeque_prov: {
                    label: "Lambayeque",
                    distritos: ["Lambayeque", "Íllimo", "Jayanca", "Mochumí", "Mórrope", "Motupe", "Olmos", "Pacora", "Salas", "San José", "Túcume"]
                }
            }
        },
        junin: {
            label: "Junín",
            provincias: {
                huancayo: {
                    label: "Huancayo",
                    distritos: [
                        "Huancayo (Cercado)", "Chilca", "El Tambo", "Huacrapuquio",
                        "Hualhuas", "Huancan", "Pilcomayo", "San Agustín de Cajas",
                        "San Jerónimo de Tunán", "Sapallanga", "Sicaya", "Viques"
                    ]
                },
                satipo: {
                    label: "Satipo",
                    distritos: ["Satipo", "Coviriali", "Llaylla", "Mazamari", "Pampa Hermosa", "Pangoa", "Río Negro", "Río Tambo"]
                }
            }
        },
        ica: {
            label: "Ica",
            provincias: {
                ica_prov: {
                    label: "Ica",
                    distritos: ["Ica (Cercado)", "La Tinguiña", "Los Aquijes", "Ocucaje", "Pachacútec", "Parcona", "Pueblo Nuevo", "Salas", "San José de Los Molinos", "San Juan Bautista", "Santiago", "Subtanjalla", "Tate", "Yauca del Rosario"]
                },
                nazca: {
                    label: "Nasca",
                    distritos: ["Nasca", "Changuillo", "El Ingenio", "Marcona", "Vista Alegre"]
                },
                pisco: {
                    label: "Pisco",
                    distritos: ["Pisco", "Huancano", "Humay", "Independencia", "Paracas", "San Andrés", "San Clemente", "Túpac Amaru Inca"]
                }
            }
        },
        tacna: {
            label: "Tacna",
            provincias: {
                tacna_prov: {
                    label: "Tacna",
                    distritos: ["Tacna (Cercado)", "Alto de la Alianza", "Calana", "Ciudad Nueva", "Coronel Gregorio Albarracín Lanchipa", "Inclán", "Pachía", "Palca", "Pocollay", "Sama"]
                }
            }
        },
        ancash: {
            label: "Áncash",
            provincias: {
                huaraz: {
                    label: "Huaraz",
                    distritos: ["Huaraz (Cercado)", "Cochabamba", "Colcabamba", "Huanchay", "Independencia", "Jangas", "La Libertad", "Olleros", "Pampas Grande", "Pariacoto", "Pira", "Tarica"]
                },
                santa: {
                    label: "Santa",
                    distritos: ["Chimbote", "Coishco", "Macate", "Moro", "Nepeña", "Nuevo Chimbote", "Samanco", "Santa"]
                }
            }
        },
        cajamarca: {
            label: "Cajamarca",
            provincias: {
                cajamarca_prov: {
                    label: "Cajamarca",
                    distritos: ["Cajamarca (Cercado)", "Asunción", "Chetilla", "Cospán", "Encañada", "Jesús", "Llacanora", "Los Baños del Inca", "Magdalena", "Matara", "Namora", "San Juan"]
                },
                jaen: {
                    label: "Jaén",
                    distritos: ["Jaén", "Bellavista", "Chontali", "Colasay", "Huabal", "Las Pirias", "Pomahuaca", "Pucará", "Sallique", "San Felipe", "San José del Alto", "Santa Rosa"]
                }
            }
        },
        loreto: {
            label: "Loreto",
            provincias: {
                maynas: {
                    label: "Maynas",
                    distritos: ["Iquitos", "Alto Nanay", "Belén", "Fernando Lores", "Indiana", "Las Amazonas", "Mazán", "Napo", "Punchana", "San Juan Bautista", "Torres Causana"]
                }
            }
        },
        puno: {
            label: "Puno",
            provincias: {
                puno_prov: {
                    label: "Puno",
                    distritos: ["Puno (Cercado)", "Acora", "Amantaní", "Atuncolla", "Capachica", "Chucuito", "Coata", "Huata", "Mañazo", "Paucarcolla", "Pichacani", "Platería", "San Antonio", "Tiquillaca", "Vilque"]
                },
                san_roman: {
                    label: "San Román",
                    distritos: ["Juliaca", "Cabana", "Cabanillas", "Caracoto"]
                }
            }
        },
        amazonas: {
            label: "Amazonas",
            provincias: {
                chachapoyas: {
                    label: "Chachapoyas",
                    distritos: ["Chachapoyas (Cercado)", "Asunción", "Balsas", "Cheto", "Chiliquín", "Chuquibamba", "Granada", "Huancas", "La Jalca", "Leimebamba", "Levanto", "Magdalena", "Mariscal Castilla", "Molinopampa", "Montevideo", "Olleros", "Quinjalca", "San Francisco de Daguas", "San Isidro de Maino", "Soloco", "Sonche"]
                }
            }
        },
        san_martin: {
            label: "San Martín",
            provincias: {
                san_martin_prov: {
                    label: "San Martín",
                    distritos: ["Tarapoto", "Alberto Leveau", "Cacatachi", "Chazuta", "Chipurana", "El Porvenir", "Huimbayoc", "Juan Guerra", "La Banda de Shilcayo", "Morales", "Papaplaya", "San Antonio", "Sauce", "Shapaja"]
                },
                moyobamba: {
                    label: "Moyobamba",
                    distritos: ["Moyobamba", "Calzada", "Habana", "Jepelacio", "Soritor", "Yantalo"]
                }
            }
        },
        ucayali: {
            label: "Ucayali",
            provincias: {
                coronel_portillo: {
                    label: "Coronel Portillo",
                    distritos: ["Callería", "Campoverde", "Iparía", "Manantay", "Masisea", "Nueva Requena", "Yarinacocha"]
                }
            }
        },
        huanuco: {
            label: "Huánuco",
            provincias: {
                huanuco_prov: {
                    label: "Huánuco",
                    distritos: ["Huánuco (Cercado)", "Amarilis", "Chinchao", "Churubamba", "Margos", "Pillco Marca", "Quisqui", "San Francisco de Cayrán", "San Pedro de Chaulán", "Santa María del Valle", "Yarumayo"]
                }
            }
        },
        madre_de_dios: {
            label: "Madre de Dios",
            provincias: {
                tambopata: {
                    label: "Tambopata",
                    distritos: ["Tambopata", "Inambari", "Las Piedras", "Laberinto"]
                }
            }
        },
        ayacucho: {
            label: "Ayacucho",
            provincias: {
                huamanga: {
                    label: "Huamanga",
                    distritos: ["Ayacucho (Cercado)", "Acocro", "Acos Vinchos", "Carmen Alto", "Chiara", "Jesús Nazareno", "Ocros", "Pacaycasa", "Quinua", "San José de Ticllas", "San Juan Bautista", "Santiago de Pischa", "Socos", "Tambillo", "Vinchos"]
                }
            }
        },
        apurimac: {
            label: "Apurímac",
            provincias: {
                abancay: {
                    label: "Abancay",
                    distritos: ["Abancay (Cercado)", "Chacoche", "Circa", "Curahuasi", "Huanipaca", "Lambrama", "Pichirhua", "San Pedro de Cachora", "Tamburco"]
                }
            }
        },
        moquegua: {
            label: "Moquegua",
            provincias: {
                mariscal_nieto: {
                    label: "Mariscal Nieto",
                    distritos: ["Moquegua", "Carumas", "Cuchumbaya", "Samegua", "San Cristóbal", "Torata"]
                }
            }
        },
        tumbes: {
            label: "Tumbes",
            provincias: {
                tumbes_prov: {
                    label: "Tumbes",
                    distritos: ["Tumbes (Cercado)", "Corrales", "La Cruz", "Pampas de Hospital", "San Jacinto", "San Juan de la Virgen"]
                }
            }
        },
        pasco: {
            label: "Pasco",
            provincias: {
                pasco_prov: {
                    label: "Pasco",
                    distritos: ["Chaupimarca", "Huachón", "Huariaca", "Huayllay", "Ninacaca", "Pallanchacra", "Paucartambo", "San Francisco de Asís de Yarusyacán", "Simón Bolívar", "Ticlacayán", "Tinyahuarco", "Vicco", "Yanacancha"]
                }
            }
        },
        huancavelica: {
            label: "Huancavelica",
            provincias: {
                huancavelica_prov: {
                    label: "Huancavelica",
                    distritos: ["Huancavelica (Cercado)", "Acobambilla", "Acoria", "Conayca", "Cuenca", "Huachocolpa", "Huayllahuara", "Izcuchaca", "Laria", "Manta", "Mariscal Cáceres", "Moya", "Nuevo Occoro", "Palca", "Pilchaca", "Vilca", "Yauli"]
                }
            }
        },
    }
}
