-- Inserir categorias
INSERT INTO categorias (nome, slug, descricao, cor) VALUES
('Política', 'politica', 'Notícias sobre política nacional e internacional', '#DC2626'),
('Economia', 'economia', 'Notícias sobre economia, mercado financeiro e negócios', '#059669'),
('Esportes', 'esportes', 'Notícias esportivas e resultados', '#2563EB'),
('Tecnologia', 'tecnologia', 'Inovações tecnológicas e ciência', '#7C3AED'),
('Saúde', 'saude', 'Notícias sobre saúde e bem-estar', '#DC2626'),
('Meio Ambiente', 'meio-ambiente', 'Sustentabilidade e meio ambiente', '#059669');

-- Inserir patrocinadores
INSERT INTO patrocinadores (nome, logo_url, link_site, ordem_exibicao) VALUES
('TechCorp Solutions', '/placeholder.svg?height=60&width=120', 'https://techcorp.com', 1),
('EcoEnergy Brasil', '/placeholder.svg?height=60&width=120', 'https://ecoenergy.com.br', 2),
('FinanceMax Investimentos', '/placeholder.svg?height=60&width=120', 'https://financemax.com.br', 3),
('HealthPlus Medicina', '/placeholder.svg?height=60&width=120', 'https://healthplus.com.br', 4),
('AutoDrive Veículos', '/placeholder.svg?height=60&width=120', 'https://autodrive.com.br', 5),
('FoodDelight Restaurantes', '/placeholder.svg?height=60&width=120', 'https://fooddelight.com.br', 6);

-- Inserir notícias de exemplo
INSERT INTO noticias (titulo, resumo, conteudo, imagem_url, categoria, autor, status, visualizacoes) VALUES
(
    'Economia brasileira cresce 2,5% no terceiro trimestre',
    'PIB supera expectativas dos analistas e mostra sinais de recuperação sustentável',
    'A economia brasileira registrou crescimento de 2,5% no terceiro trimestre de 2024, superando as expectativas dos analistas que projetavam alta de 1,8%. O resultado representa a maior expansão trimestral dos últimos dois anos e indica sinais consistentes de recuperação econômica.\n\nO crescimento foi impulsionado principalmente pelo setor de serviços, que avançou 3,1%, seguido pela indústria com alta de 2,3%. O agronegócio também contribuiu positivamente, registrando expansão de 1,9% no período.\n\nSegundo o Instituto Brasileiro de Geografia e Estatística (IBGE), o consumo das famílias foi o principal motor do crescimento, com alta de 2,8%. Os investimentos empresariais também mostraram recuperação, crescendo 4,2% no trimestre.',
    '/placeholder.svg?height=400&width=800',
    'Economia',
    'João Silva',
    'publicado',
    1250
),
(
    'Nova tecnologia promete revolucionar energia solar',
    'Pesquisadores desenvolvem células fotovoltaicas com eficiência 40% maior',
    'Pesquisadores da Universidade Federal de São Paulo desenvolveram uma nova tecnologia de células fotovoltaicas que promete revolucionar o setor de energia solar no Brasil. A inovação permite um aumento de 40% na eficiência de conversão da luz solar em energia elétrica.\n\nA tecnologia utiliza materiais nanoestruturados que capturam uma faixa mais ampla do espectro solar, incluindo radiação infravermelha que tradicionalmente era desperdiçada. O processo de fabricação também é mais sustentável, utilizando 60% menos materiais tóxicos.\n\nOs testes realizados em laboratório mostraram que as novas células mantêm alta eficiência mesmo em condições de baixa luminosidade, um avanço significativo para regiões com menor incidência solar.',
    '/placeholder.svg?height=400&width=800',
    'Tecnologia',
    'Maria Santos',
    'publicado',
    890
);

-- Inserir anúncios
INSERT INTO anuncios (noticia_id, titulo, imagem_url, link_destino, posicao_no_texto, tipo) VALUES
(1, 'Investimentos TechCorp', '/placeholder.svg?height=150&width=728', 'https://techcorp.com/investimentos', 2, 'integrado'),
(1, 'EcoEnergy Solar', '/placeholder.svg?height=250&width=300', 'https://ecoenergy.com.br/solar', 0, 'lateral'),
(2, 'FinanceMax Tech', '/placeholder.svg?height=150&width=728', 'https://financemax.com.br/tech', 1, 'integrado');
