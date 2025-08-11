import React, { useState, useEffect } from 'react';
import { 
  IonSearchbar, 
  IonButton, 
  IonIcon, 
  IonItem, 
  IonList, 
  IonLabel,
  IonSelect,
  IonSelectOption,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonGrid,
  IonRow,
  IonCol,
  IonImg,
  IonSpinner,
  IonText
} from '@ionic/react';
import { 
  searchOutline, 
  filterOutline 
} from 'ionicons/icons';

interface BusquedaProps {
  onSearch?: (query: string, filters?: SearchFilters) => void;
  placeholder?: string;
  showAdvancedFilters?: boolean;
  onResultClick?: (producto: ProductoResultado) => void;
}

interface SearchFilters {
  categoria?: string;
  genero?: string;
  marca?: string;
  precioMin?: number;
  precioMax?: number;
}

interface ProductoResultado {
  idProducto: number;
  vchNombreProducto: string;
  Precio: number;
  categoria?: string;
  genero?: string;
  marca?: string;
  Imagen?: string;
  Descripcion?: string;
}

const Buscar: React.FC<BusquedaProps> = ({ 
  onSearch, 
  placeholder = "Buscar en Betterware...", 
  showAdvancedFilters = false,
  onResultClick 
}) => {
  const [searchText, setSearchText] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({});
  const [resultados, setResultados] = useState<ProductoResultado[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Opciones de filtros (estos podrían venir de una API)
  const [categoriasDisponibles] = useState(['Hogar', 'Cocina', 'Limpieza', 'Belleza']);
  const [generosDisponibles] = useState(['Hombre', 'Mujer', 'Unisex']);
  const [marcasDisponibles] = useState(['Betterware', 'Premium', 'Eco-Friendly']);

  const handleSearch = async (query?: string) => {
    const searchQuery = query || searchText;
    
    if (!searchQuery.trim()) {
      setResultados([]);
      if (onSearch) {
        onSearch('');
      }
      return;
    }

    setLoading(true);
    
    try {
      // Construir URL con filtros
      const searchParams = new URLSearchParams();
      searchParams.append('busqueda', searchQuery);
      
      if (filters.categoria && filters.categoria !== 'all') {
        searchParams.append('categoria', filters.categoria);
      }
      if (filters.genero && filters.genero !== 'all') {
        searchParams.append('genero', filters.genero);
      }
      if (filters.marca && filters.marca !== 'all') {
        searchParams.append('marca', filters.marca);
      }
      if (filters.precioMin) {
        searchParams.append('precioMin', filters.precioMin.toString());
      }
      if (filters.precioMax) {
        searchParams.append('precioMax', filters.precioMax.toString());
      }

      const response = await fetch(`https://backbetter-production.up.railway.app/productos/Buscar_productos?${searchParams}`);
      
      if (!response.ok) {
        throw new Error('Error al buscar productos');
      }
      
      const data = await response.json();
      setResultados(data);
      
      if (onSearch) {
        onSearch(searchQuery, filters);
      }
      
    } catch (error) {
      console.error('Error en búsqueda:', error);
      setResultados([]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const clearFilters = () => {
    setFilters({});
  };

  const handleResultClick = (producto: ProductoResultado) => {
    if (onResultClick) {
      onResultClick(producto);
    }
  };

  const renderResultados = () => {
    if (loading) {
      return (
        <div className="text-center py-4">
          <IonSpinner name="crescent" color="primary" />
        </div>
      );
    }

    if (!searchText || resultados.length === 0) {
      return searchText && resultados.length === 0 && !loading ? (
        <div className="text-center py-4">
          <IonText color="medium">
            <p>No se encontraron productos para "{searchText}"</p>
          </IonText>
        </div>
      ) : null;
    }

    return (
      <div className="mt-4">
        <IonText>
          <h4>Resultados de búsqueda ({resultados.length})</h4>
        </IonText>
        <IonList>
          {resultados.map((producto) => (
            <IonItem 
              key={producto.idProducto} 
              button
              onClick={() => handleResultClick(producto)}
            >
              {producto.Imagen && (
                <IonImg 
                  src={producto.Imagen} 
                  alt={producto.vchNombreProducto}
                  className="w-16 h-16 object-cover rounded mr-4"
                />
              )}
              <IonLabel>
                <h3 className="font-semibold">{producto.vchNombreProducto}</h3>
                <p className="text-green-600 font-bold">${producto.Precio}</p>
                {producto.categoria && (
                  <p className="text-sm text-gray-600">{producto.categoria}</p>
                )}
                {producto.Descripcion && (
                  <p className="text-sm text-gray-500 line-clamp-2">{producto.Descripcion}</p>
                )}
              </IonLabel>
            </IonItem>
          ))}
        </IonList>
      </div>
    );
  };

  return (
    <div>
      {/* Barra de búsqueda principal */}
      <div className="flex items-center space-x-2 mb-4">
        <IonSearchbar
          value={searchText}
          placeholder={placeholder}
          style={{'--border-radius': '9999px'} as React.CSSProperties}
          onIonInput={(e: CustomEvent) => setSearchText(e.detail.value!)}
          onKeyPress={handleKeyPress}
          className="flex-1"
        />
        
        {showAdvancedFilters && (
          <IonButton 
            fill="outline"
            color="medium"
            onClick={() => setShowFilters(!showFilters)}
          >
            <IonIcon icon={filterOutline} />
          </IonButton>
        )}
      </div>

      {/* Filtros avanzados */}
      {showAdvancedFilters && showFilters && (
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>Filtros Avanzados</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonGrid>
              <IonRow>
                <IonCol size="6">
                  <IonItem>
                    <IonLabel>Categoría</IonLabel>
                    <IonSelect
                      value={filters.categoria || 'all'}
                      onIonChange={(e: CustomEvent) => 
                        setFilters({...filters, categoria: e.detail.value})
                      }
                    >
                      <IonSelectOption value="all">Todas</IonSelectOption>
                      {categoriasDisponibles.map(cat => (
                        <IonSelectOption key={cat} value={cat}>{cat}</IonSelectOption>
                      ))}
                    </IonSelect>
                  </IonItem>
                </IonCol>
                
                <IonCol size="6">
                  <IonItem>
                    <IonLabel>Género</IonLabel>
                    <IonSelect
                      value={filters.genero || 'all'}
                      onIonChange={(e: CustomEvent) => 
                        setFilters({...filters, genero: e.detail.value})
                      }
                    >
                      <IonSelectOption value="all">Todos</IonSelectOption>
                      {generosDisponibles.map(gen => (
                        <IonSelectOption key={gen} value={gen}>{gen}</IonSelectOption>
                      ))}
                    </IonSelect>
                  </IonItem>
                </IonCol>
              </IonRow>
              
              <IonRow>
                <IonCol size="6">
                  <IonItem>
                    <IonLabel>Marca</IonLabel>
                    <IonSelect
                      value={filters.marca || 'all'}
                      onIonChange={(e: CustomEvent) => 
                        setFilters({...filters, marca: e.detail.value})
                      }
                    >
                      <IonSelectOption value="all">Todas</IonSelectOption>
                      {marcasDisponibles.map(marca => (
                        <IonSelectOption key={marca} value={marca}>{marca}</IonSelectOption>
                      ))}
                    </IonSelect>
                  </IonItem>
                </IonCol>
                
                <IonCol size="6">
                  <div className="flex space-x-2">
                    <IonButton
                      fill="outline"
                      size="small"
                      color="danger"
                      onClick={clearFilters}
                    >
                      Limpiar
                    </IonButton>
                    <IonButton
                      fill="solid"
                      size="small"
                      color="primary"
                      onClick={() => handleSearch()}
                    >
                      Aplicar
                    </IonButton>
                  </div>
                </IonCol>
              </IonRow>
            </IonGrid>
          </IonCardContent>
        </IonCard>
      )}

      {/* Resultados de búsqueda */}
      {renderResultados()}
    </div>
  );
};

export default Buscar;