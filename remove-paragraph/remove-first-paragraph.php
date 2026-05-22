<?php
/**
 * Plugin Name: Remove First Paragraph – Glossário
 * Description: Remove o primeiro parágrafo do post_content do CPT glossario.
 *              Pula o post se o 1º parágrafo contiver <strong id (conteúdo já correto).
 * Version:     2.0.0
 * Author:      Seu Nome
 * License:     GPL2
 */

if ( ! defined( 'ABSPATH' ) ) {
    exit;
}

// ─── Menu Admin ───────────────────────────────────────────────────────────────

add_action( 'admin_menu', function () {
    add_menu_page(
        'Remove 1º Parágrafo',
        'Remove § Glossário',
        'manage_options',
        'remove-first-paragraph-glossario',
        'rfpg_render_page',
        'dashicons-editor-removeformatting',
        80
    );
} );

// ─── Estilos ──────────────────────────────────────────────────────────────────

add_action( 'admin_head', function () {
    $screen = get_current_screen();
    if ( ! $screen || $screen->id !== 'toplevel_page_remove-first-paragraph-glossario' ) return;
    ?>
    <style>
        .rfpg-wrap { max-width: 800px; margin: 40px auto; font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
        .rfpg-card { background: #fff; border: 1px solid #e0e0e0; border-radius: 8px; padding: 32px 36px; margin-bottom: 24px; box-shadow: 0 1px 4px rgba(0,0,0,.06); }
        .rfpg-card h2 { margin-top: 0; font-size: 1.25rem; color: #1d2327; }
        .rfpg-card p  { color: #50575e; line-height: 1.6; }
        .rfpg-fields label { display: block; font-weight: 600; margin-bottom: 6px; color: #1d2327; font-size: .9rem; }
        .rfpg-fields input[type=text],
        .rfpg-fields input[type=number] { width: 100%; padding: 8px 12px; border: 1px solid #c3c4c7; border-radius: 4px; font-size: .9rem; margin-bottom: 16px; box-sizing: border-box; }
        .rfpg-fields .rfpg-row { display: flex; gap: 20px; }
        .rfpg-fields .rfpg-row > div { flex: 1; }
        .rfpg-btn { display: inline-flex; align-items: center; gap: 8px; border: none; padding: 10px 22px; border-radius: 4px; font-size: .9rem; cursor: pointer; font-weight: 600; transition: background .2s; }
        .rfpg-btn.primary   { background: #2271b1; color: #fff; }
        .rfpg-btn.primary:hover { background: #135e96; }
        .rfpg-btn.danger    { background: #d63638; color: #fff; }
        .rfpg-btn.danger:hover { background: #b32d2e; }
        .rfpg-btn.secondary { background: #50575e; color: #fff; }
        .rfpg-btn.secondary:hover { background: #3c434a; }
        .rfpg-log { background: #1e1e1e; color: #d4d4d4; border-radius: 6px; padding: 20px; font-family: "Courier New", monospace; font-size: .82rem; line-height: 1.75; max-height: 420px; overflow-y: auto; white-space: pre-wrap; word-break: break-all; }
        .rfpg-log .ok   { color: #4ec9b0; }
        .rfpg-log .skip { color: #ce9178; }
        .rfpg-log .done { color: #569cd6; font-weight: bold; }
        .rfpg-log .err  { color: #f44747; }
        .rfpg-log .info { color: #dcdcaa; }
        .rfpg-notice { padding: 12px 16px; border-left: 4px solid; border-radius: 0 4px 4px 0; margin-bottom: 20px; }
        .rfpg-notice.warning { background: #fff8e5; border-color: #dba617; color: #7a5900; }
        .rfpg-stats { display: flex; gap: 16px; margin-top: 20px; flex-wrap: wrap; }
        .rfpg-stat  { flex: 1; min-width: 120px; background: #f6f7f7; border: 1px solid #e0e0e0; border-radius: 6px; padding: 14px 18px; text-align: center; }
        .rfpg-stat strong { display: block; font-size: 1.8rem; color: #2271b1; line-height: 1.2; }
        .rfpg-stat span { font-size: .8rem; color: #50575e; }
        hr.rfpg-sep { border: none; border-top: 1px solid #e0e0e0; margin: 20px 0; }
        .rfpg-action-row { display: flex; gap: 12px; flex-wrap: wrap; align-items: center; }
        .rfpg-preview-group { display: flex; gap: 8px; align-items: center; }
        .rfpg-preview-group input { margin-bottom: 0 !important; width: 180px !important; }
    </style>
    <?php
} );

// ─── Página principal ─────────────────────────────────────────────────────────

function rfpg_render_page() {
    if ( ! current_user_can( 'manage_options' ) ) wp_die( 'Sem permissão.' );

    $post_type  = isset( $_POST['rfpg_post_type'] )  ? sanitize_text_field( $_POST['rfpg_post_type'] ) : 'glossario';
    $preview_id = isset( $_POST['rfpg_preview_id'] ) ? absint( $_POST['rfpg_preview_id'] )             : 0;
    $action     = isset( $_POST['rfpg_action'] )     ? $_POST['rfpg_action']                          : '';

    $log   = '';
    $stats = null;

    $nonce_ok = isset( $_POST['rfpg_nonce'] ) && wp_verify_nonce( $_POST['rfpg_nonce'], 'rfpg_action' );

    if ( $nonce_ok && $action === 'preview' && $preview_id ) {
        ob_start();
        rfpg_process( $post_type, true, $preview_id );
        $log = ob_get_clean();
    }

    if ( $nonce_ok && $action === 'run' ) {
        ob_start();
        $stats = rfpg_process( $post_type, false );
        $log   = ob_get_clean();
    }
    ?>
    <div class="rfpg-wrap">
        <h1 style="font-size:1.5rem;margin-bottom:4px;">🗑️ Remove 1º Parágrafo — Glossário</h1>
        <p style="color:#50575e;margin-top:0;margin-bottom:24px;">
            Remove o primeiro <code>&lt;p&gt;</code> do <code>post_content</code> do CPT informado.<br>
            <strong>Condição de segurança:</strong> se o 1º parágrafo contiver <code>&lt;strong id</code>, o post é <em>pulado</em> — conteúdo já está correto.
        </p>

        <div class="rfpg-notice warning">
            ⚠️ <strong>Atenção:</strong> operação irreversível. Faça <strong>backup do banco</strong> antes de executar em massa.
        </div>

        <div class="rfpg-card">
            <h2>⚙️ Configurações</h2>
            <form method="POST">
                <?php wp_nonce_field( 'rfpg_action', 'rfpg_nonce' ); ?>
                <div class="rfpg-fields">
                    <div class="rfpg-row">
                        <div>
                            <label for="rfpg_post_type">Post Type (CPT)</label>
                            <input type="text" id="rfpg_post_type" name="rfpg_post_type"
                                   value="<?php echo esc_attr( $post_type ); ?>"
                                   placeholder="ex: glossario" />
                        </div>
                    </div>

                    <hr class="rfpg-sep">

                    <p style="margin:0 0 12px;color:#50575e;font-size:.9rem;">
                        💡 <strong>Dica:</strong> Teste em um post específico antes de executar em massa.
                    </p>

                    <div class="rfpg-action-row">
                        <div class="rfpg-preview-group">
                            <input type="number" name="rfpg_preview_id" id="rfpg_preview_id"
                                   value="<?php echo esc_attr( $preview_id ); ?>"
                                   placeholder="ID do post" />
                            <button type="submit" name="rfpg_action" value="preview" class="rfpg-btn secondary">
                                🔍 Testar post
                            </button>
                        </div>

                        <button type="submit" name="rfpg_action" value="run" class="rfpg-btn danger"
                                onclick="return confirm('Executar em TODOS os posts do tipo \'<?php echo esc_js( $post_type ); ?>\'?\n\nVocê fez backup do banco?')">
                            ⚡ Executar em todos
                        </button>
                    </div>
                </div>
            </form>
        </div>

        <?php if ( $log ) : ?>
        <div class="rfpg-card">
            <h2><?php echo $action === 'preview' ? '🔍 Preview — Post #' . esc_html( $preview_id ) : '📋 Log de execução'; ?></h2>
            <div class="rfpg-log"><?php echo $log; ?></div>

            <?php if ( $stats ) : ?>
            <div class="rfpg-stats">
                <div class="rfpg-stat">
                    <strong><?php echo $stats['total']; ?></strong>
                    <span>Encontrados</span>
                </div>
                <div class="rfpg-stat">
                    <strong style="color:#00a32a;"><?php echo $stats['updated']; ?></strong>
                    <span>Atualizados</span>
                </div>
                <div class="rfpg-stat">
                    <strong style="color:#dba617;"><?php echo $stats['skipped']; ?></strong>
                    <span>Pulados</span>
                </div>
                <div class="rfpg-stat">
                    <strong style="color:#d63638;"><?php echo $stats['errors']; ?></strong>
                    <span>Erros</span>
                </div>
            </div>
            <?php endif; ?>
        </div>
        <?php endif; ?>
    </div>
    <?php
}

// ─── Lógica principal ─────────────────────────────────────────────────────────

function rfpg_process( $post_type, $is_preview = false, $single_id = 0 ) {

    $query_args = [
        'post_type'      => $post_type,
        'posts_per_page' => -1,
        'post_status'    => 'publish',
        'fields'         => 'ids',
    ];

    if ( $single_id ) {
        $query_args['include']        = [ $single_id ];
        $query_args['posts_per_page'] = 1;
    }

    $ids     = get_posts( $query_args );
    $total   = count( $ids );
    $updated = 0;
    $skipped = 0;
    $errors  = 0;

    echo "<span class='done'>» Iniciando — {$total} post(s) | post_type: {$post_type}</span>\n\n";

    foreach ( $ids as $post_id ) {
        $title   = get_the_title( $post_id );
        $content = get_post_field( 'post_content', $post_id );

        if ( empty( trim( $content ) ) ) {
            echo "<span class='skip'>  [PULADO]  #{$post_id} — {$title} (post_content vazio)</span>\n";
            $skipped++;
            continue;
        }

        // ── Conteúdo Gutenberg (com blocos) ───────────────────────────────────
        if ( has_blocks( $content ) ) {

            $blocks     = parse_blocks( $content );
            $first_idx  = null;
            $first_html = '';

            foreach ( $blocks as $i => $block ) {
                if ( $block['blockName'] === 'core/paragraph' ) {
                    $first_idx  = $i;
                    $first_html = $block['innerHTML'] ?? '';
                    break;
                }
            }

            if ( $first_idx === null ) {
                echo "<span class='skip'>  [PULADO]  #{$post_id} — {$title} (nenhum parágrafo encontrado)</span>\n";
                $skipped++;
                continue;
            }

            // Condição de segurança: 1º § tem <strong id → conteúdo já correto
            if ( rfpg_has_strong_id( $first_html ) ) {
                echo "<span class='skip'>  [PULADO]  #{$post_id} — {$title} (1º § contém &lt;strong id&gt; — já correto)</span>\n";
                $skipped++;
                continue;
            }

            $preview_text = mb_strimwidth( wp_strip_all_tags( $first_html ), 0, 100, '...' );

            if ( $is_preview ) {
                echo "<span class='ok'>  [PREVIEW] #{$post_id} — {$title}</span>\n";
                echo "<span class='info'>           Seria removido: \"{$preview_text}\"</span>\n\n";
                continue;
            }

            array_splice( $blocks, $first_idx, 1 );
            $new_content = serialize_blocks( $blocks );

        } else {
            // ── Conteúdo clássico (sem blocos) ────────────────────────────────

            if ( ! preg_match( '/<p[^>]*>(.*?)<\/p>/is', $content, $match ) ) {
                echo "<span class='skip'>  [PULADO]  #{$post_id} — {$title} (nenhuma tag &lt;p&gt; encontrada)</span>\n";
                $skipped++;
                continue;
            }

            $first_html = $match[0];

            // Condição de segurança
            if ( rfpg_has_strong_id( $first_html ) ) {
                echo "<span class='skip'>  [PULADO]  #{$post_id} — {$title} (1º § contém &lt;strong id&gt; — já correto)</span>\n";
                $skipped++;
                continue;
            }

            $preview_text = mb_strimwidth( wp_strip_all_tags( $first_html ), 0, 100, '...' );

            if ( $is_preview ) {
                echo "<span class='ok'>  [PREVIEW] #{$post_id} — {$title}</span>\n";
                echo "<span class='info'>           Seria removido: \"{$preview_text}\"</span>\n\n";
                continue;
            }

            // Remove apenas a 1ª ocorrência do <p>
            $new_content = preg_replace( '/<p[^>]*>.*?<\/p>/is', '', $content, 1 );
        }

        // ── Salva no post_content ─────────────────────────────────────────────
        $result = wp_update_post( [
            'ID'           => $post_id,
            'post_content' => $new_content,
        ], true );

        if ( is_wp_error( $result ) ) {
            echo "<span class='err'>  [ERRO]    #{$post_id} — {$title}: " . $result->get_error_message() . "</span>\n";
            $errors++;
        } else {
            echo "<span class='ok'>  [OK]      #{$post_id} — {$title}</span>\n";
            echo "<span class='info'>           Removido: \"{$preview_text}\"</span>\n";
            $updated++;
        }
    }

    echo "\n<span class='done'>» Concluído — Atualizados: {$updated} | Pulados: {$skipped} | Erros: {$errors}</span>\n";

    return compact( 'total', 'updated', 'skipped', 'errors' );
}

// ─── Helper: verifica <strong id ─────────────────────────────────────────────

function rfpg_has_strong_id( $html ) {
    return (bool) preg_match( '/<strong\s[^>]*id\s*=/i', $html );
}
