-- Procedures para o painel administrativo

-- Procedure para buscar notícias com filtros
DELIMITER //
CREATE PROCEDURE GetNoticiasFiltradas(
    IN p_search VARCHAR(255),
    IN p_status VARCHAR(50),
    IN p_categoria VARCHAR(100),
    IN p_limit INT,
    IN p_offset INT
)
BEGIN
    SELECT 
        n.id,
        n.titulo,
        n.resumo,
        n.categoria,
        n.status,
        n.visualizacoes,
        n.data_publicacao,
        n.imagem_url,
        n.autor,
        COUNT(*) OVER() as total_count
    FROM noticias n
    WHERE 
        (p_search IS NULL OR n.titulo LIKE CONCAT('%', p_search, '%'))
        AND (p_status IS NULL OR p_status = 'Todos' OR n.status = p_status)
        AND (p_categoria IS NULL OR n.categoria = p_categoria)
    ORDER BY n.data_publicacao DESC
    LIMIT p_limit OFFSET p_offset;
END //
DELIMITER ;

-- Procedure para estatísticas do dashboard
DELIMITER //
CREATE PROCEDURE GetDashboardStats()
BEGIN
    SELECT 
        (SELECT COUNT(*) FROM noticias) as total_noticias,
        (SELECT COUNT(*) FROM noticias WHERE DATE(data_publicacao) = CURDATE()) as noticias_hoje,
        (SELECT SUM(visualizacoes) FROM noticias) as total_visualizacoes,
        (SELECT COUNT(*) FROM patrocinadores WHERE ativo = TRUE) as patrocinadores_ativos,
        (SELECT COUNT(*) FROM noticias WHERE status = 'publicado') as noticias_publicadas;
END //
DELIMITER ;

-- Procedure para inserir nova notícia
DELIMITER //
CREATE PROCEDURE InserirNoticia(
    IN p_titulo VARCHAR(255),
    IN p_resumo TEXT,
    IN p_conteudo LONGTEXT,
    IN p_categoria VARCHAR(100),
    IN p_imagem_url VARCHAR(500),
    IN p_autor VARCHAR(100),
    IN p_status VARCHAR(50)
)
BEGIN
    INSERT INTO noticias (titulo, resumo, conteudo, categoria, imagem_url, autor, status)
    VALUES (p_titulo, p_resumo, p_conteudo, p_categoria, p_imagem_url, p_autor, p_status);
    
    SELECT LAST_INSERT_ID() as noticia_id;
END //
DELIMITER ;

-- Procedure para atualizar notícia
DELIMITER //
CREATE PROCEDURE AtualizarNoticia(
    IN p_id INT,
    IN p_titulo VARCHAR(255),
    IN p_resumo TEXT,
    IN p_conteudo LONGTEXT,
    IN p_categoria VARCHAR(100),
    IN p_imagem_url VARCHAR(500),
    IN p_status VARCHAR(50)
)
BEGIN
    UPDATE noticias 
    SET 
        titulo = p_titulo,
        resumo = p_resumo,
        conteudo = p_conteudo,
        categoria = p_categoria,
        imagem_url = p_imagem_url,
        status = p_status,
        updated_at = CURRENT_TIMESTAMP
    WHERE id = p_id;
END //
DELIMITER ;

-- Procedure para gerenciar patrocinadores
DELIMITER //
CREATE PROCEDURE InserirPatrocinador(
    IN p_nome VARCHAR(100),
    IN p_logo_url VARCHAR(500),
    IN p_link_site VARCHAR(500),
    IN p_ativo BOOLEAN
)
BEGIN
    INSERT INTO patrocinadores (nome, logo_url, link_site, ativo)
    VALUES (p_nome, p_logo_url, p_link_site, p_ativo);
    
    SELECT LAST_INSERT_ID() as patrocinador_id;
END //
DELIMITER ;
