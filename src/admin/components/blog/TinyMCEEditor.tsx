import React, { useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';

/**
 * Composant TinyMCE Editor pour le contenu riche des articles de blog
 * WYSIWYG complet (comme WordPress)
 */

interface TinyMCEEditorProps {
  value: string;
  onChange: (content: string) => void;
  height?: number;
  placeholder?: string;
}

const TinyMCEEditor: React.FC<TinyMCEEditorProps> = ({
  value,
  onChange,
  height = 600,
  placeholder = 'Écrivez votre article ici...',
}) => {
  const editorRef = useRef<any>(null);

  return (
    <div className="tinymce-wrapper">
      <Editor
        apiKey="bu54mzi9mcvwxpiejvgojjc3wb4eybm74111d2ej6lc7eztr"
        onInit={(evt, editor) => (editorRef.current = editor)}
        value={value}
        onEditorChange={onChange}
        init={{
          height,
          menubar: true,
          plugins: [
            'advlist',
            'autolink',
            'lists',
            'link',
            'image',
            'charmap',
            'preview',
            'anchor',
            'searchreplace',
            'visualblocks',
            'code',
            'fullscreen',
            'insertdatetime',
            'media',
            'table',
            'help',
            'wordcount',
            'codesample',
          ],
          toolbar:
            'undo redo | blocks | ' +
            'bold italic forecolor | alignleft aligncenter ' +
            'alignright alignjustify | bullist numlist outdent indent | ' +
            'removeformat | link image media codesample | code preview fullscreen | help',
          content_style: `
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
              font-size: 16px;
              line-height: 1.6;
              color: #1f2937;
              padding: 20px;
              background: #ffffff;
            }
            img {
              max-width: 100%;
              height: auto;
              border-radius: 8px;
              margin: 20px 0;
            }
            pre {
              background: #1e293b;
              color: #e2e8f0;
              padding: 16px;
              border-radius: 8px;
              overflow-x: auto;
              font-size: 14px;
              line-height: 1.5;
            }
            code {
              background: #f1f5f9;
              color: #e11d48;
              padding: 2px 6px;
              border-radius: 4px;
              font-size: 14px;
              font-family: 'Monaco', 'Courier New', monospace;
            }
            pre code {
              background: transparent;
              color: inherit;
              padding: 0;
            }
            blockquote {
              border-left: 4px solid #3b82f6;
              margin: 20px 0;
              padding: 10px 20px;
              background: #f0f9ff;
              font-style: italic;
            }
            table {
              border-collapse: collapse;
              width: 100%;
              margin: 20px 0;
            }
            table th,
            table td {
              border: 1px solid #e5e7eb;
              padding: 12px;
              text-align: left;
            }
            table th {
              background: #f9fafb;
              font-weight: 600;
            }
            h1 {
              font-size: 2.5rem;
              font-weight: 700;
              margin-top: 0;
              margin-bottom: 1rem;
              line-height: 1.2;
            }
            h2 {
              font-size: 2rem;
              font-weight: 700;
              margin-top: 2rem;
              margin-bottom: 1rem;
              line-height: 1.3;
            }
            h3 {
              font-size: 1.5rem;
              font-weight: 600;
              margin-top: 1.5rem;
              margin-bottom: 0.75rem;
            }
            p {
              margin-bottom: 1rem;
            }
            ul, ol {
              margin: 1rem 0;
              padding-left: 2rem;
            }
            li {
              margin-bottom: 0.5rem;
            }
            a {
              color: #3b82f6;
              text-decoration: underline;
            }
            a:hover {
              color: #2563eb;
            }
          `,
          placeholder,
          skin: 'oxide',
          content_css: 'default',
          images_upload_handler: async (blobInfo: any) => {
            return new Promise((resolve) => {
              const reader = new FileReader();
              reader.onload = () => {
                resolve(reader.result as string);
              };
              reader.readAsDataURL(blobInfo.blob());
            });
          },
          codesample_languages: [
            { text: 'HTML/XML', value: 'markup' },
            { text: 'JavaScript', value: 'javascript' },
            { text: 'TypeScript', value: 'typescript' },
            { text: 'CSS', value: 'css' },
            { text: 'PHP', value: 'php' },
            { text: 'Python', value: 'python' },
            { text: 'Java', value: 'java' },
            { text: 'C', value: 'c' },
            { text: 'C++', value: 'cpp' },
            { text: 'C#', value: 'csharp' },
            { text: 'SQL', value: 'sql' },
            { text: 'Bash', value: 'bash' },
            { text: 'JSON', value: 'json' },
          ],
          branding: false,
          resize: true,
          statusbar: true,
          elementpath: false,
          promotion: false,
        }}
      />

      <div className="mt-2 text-xs text-gray-500">
        💡 <strong>Pour production :</strong> Obtiens une clé API gratuite sur{' '}
        <a
          href="https://www.tiny.cloud/auth/signup/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-cyan-500 hover:underline"
        >
          tiny.cloud
        </a>{' '}
        (1000 chargements/mois gratuit)
      </div>
    </div>
  );
};

export default TinyMCEEditor;
