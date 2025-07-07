import { InvoiceData } from './invoicePDFService';

export const generateInvoiceXML = (invoice: InvoiceData): void => {
  const xmlContent = createNFeXML(invoice);
  downloadXMLFile(xmlContent, `NFe-${invoice.invoice_number}.xml`);
};

const createNFeXML = (invoice: InvoiceData): string => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toISOString().slice(0, 19);
  };

  const formatNumber = (value: number, decimals: number = 2) => {
    return value.toFixed(decimals);
  };

  return `<?xml version="1.0" encoding="UTF-8"?>
<nfeProc xmlns="http://www.portalfiscal.inf.br/nfe" versao="4.00">
  <NFe>
    <infNFe Id="NFe${invoice.invoice_number.replace(/\D/g, '').padStart(44, '0')}">
      <!-- Identificação da NF-e -->
      <ide>
        <cUF>35</cUF> <!-- São Paulo -->
        <cNF>${invoice.invoice_number.replace(/\D/g, '').padStart(8, '0')}</cNF>
        <natOp>Venda</natOp>
        <mod>55</mod>
        <serie>001</serie>
        <nNF>${invoice.invoice_number.replace(/\D/g, '')}</nNF>
        <dhEmi>${formatDate(invoice.issue_date)}</dhEmi>
        <tpNF>1</tpNF> <!-- Saída -->
        <idDest>1</idDest> <!-- Operação interna -->
        <cMunFG>3550308</cMunFG> <!-- São Paulo -->
        <tpImp>1</tpImp> <!-- Retrato -->
        <tpEmis>1</tpEmis> <!-- Emissão normal -->
        <cDV>0</cDV>
        <tpAmb>2</tpAmb> <!-- Homologação -->
        <finNFe>1</finNFe> <!-- Normal -->
        <indFinal>1</indFinal> <!-- Consumidor final -->
        <indPres>1</indPres> <!-- Operação presencial -->
        <procEmi>0</procEmi> <!-- Aplicativo do contribuinte -->
        <verProc>1.0</verProc>
      </ide>

      <!-- Emitente -->
      <emit>
        <CNPJ>00000000000000</CNPJ>
        <xNome>Empresa Exemplo Ltda</xNome>
        <xFant>Empresa Exemplo</xFant>
        <enderEmit>
          <xLgr>Rua Exemplo</xLgr>
          <nro>123</nro>
          <xBairro>Centro</xBairro>
          <cMun>3550308</cMun>
          <xMun>São Paulo</xMun>
          <UF>SP</UF>
          <CEP>01000000</CEP>
          <cPais>1058</cPais>
          <xPais>Brasil</xPais>
        </enderEmit>
        <IE>123456789012</IE>
        <CRT>3</CRT> <!-- Regime Normal -->
      </emit>

      <!-- Destinatário -->
      <dest>
        <xNome>${invoice.customers.name}</xNome>
        <email>${invoice.customers.email}</email>
        <indIEDest>9</indIEDest> <!-- Não contribuinte -->
      </dest>

      <!-- Detalhamento dos Produtos/Serviços -->
      ${invoice.invoice_items?.map((item, index) => `
      <det nItem="${index + 1}">
        <prod>
          <cProd>${(index + 1).toString().padStart(6, '0')}</cProd>
          <cEAN></cEAN>
          <xProd>${item.description}</xProd>
          <NCM>00000000</NCM>
          <CFOP>5102</CFOP>
          <uCom>UN</uCom>
          <qCom>${formatNumber(item.quantity, 4)}</qCom>
          <vUnCom>${formatNumber(item.unit_price, 10)}</vUnCom>
          <vProd>${formatNumber(item.subtotal)}</vProd>
          <cEANTrib></cEANTrib>
          <uTrib>UN</uTrib>
          <qTrib>${formatNumber(item.quantity, 4)}</qTrib>
          <vUnTrib>${formatNumber(item.unit_price, 10)}</vUnTrib>
          <indTot>1</indTot>
        </prod>
        <imposto>
          <ICMS>
            <ICMS00>
              <orig>0</orig>
              <CST>00</CST>
              <modBC>3</modBC>
              <vBC>${formatNumber(item.subtotal)}</vBC>
              <pICMS>${formatNumber(item.tax_rate)}</pICMS>
              <vICMS>${formatNumber(item.subtotal * item.tax_rate / 100)}</vICMS>
            </ICMS00>
          </ICMS>
        </imposto>
      </det>
      `).join('') || ''}

      <!-- Totais -->
      <total>
        <ICMSTot>
          <vBC>${formatNumber(invoice.subtotal)}</vBC>
          <vICMS>${formatNumber(invoice.tax_amount)}</vICMS>
          <vICMSDeson>0.00</vICMSDeson>
          <vBCST>0.00</vBCST>
          <vST>0.00</vST>
          <vProd>${formatNumber(invoice.subtotal)}</vProd>
          <vFrete>0.00</vFrete>
          <vSeg>0.00</vSeg>
          <vDesc>${formatNumber(invoice.discount_amount)}</vDesc>
          <vII>0.00</vII>
          <vIPI>0.00</vIPI>
          <vPIS>0.00</vPIS>
          <vCOFINS>0.00</vCOFINS>
          <vOutro>0.00</vOutro>
          <vNF>${formatNumber(invoice.total_amount)}</vNF>
        </ICMSTot>
      </total>

      <!-- Informações de Transporte -->
      <transp>
        <modFrete>9</modFrete> <!-- Sem ocorrência de transporte -->
      </transp>

      <!-- Informações de Pagamento -->
      <pag>
        <detPag>
          <indPag>0</indPag> <!-- Pagamento à vista -->
          <tPag>01</tPag> <!-- Dinheiro -->
          <vPag>${formatNumber(invoice.total_amount)}</vPag>
        </detPag>
      </pag>

      <!-- Informações Adicionais -->
      ${invoice.notes ? `
      <infAdic>
        <infCpl>${invoice.notes}</infCpl>
      </infAdic>
      ` : ''}
    </infNFe>
  </NFe>
</nfeProc>`;
};

const downloadXMLFile = (content: string, filename: string): void => {
  const blob = new Blob([content], { type: 'application/xml' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};